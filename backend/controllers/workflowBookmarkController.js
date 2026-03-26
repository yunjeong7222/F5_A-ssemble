const db = require('../config/db');

// 북마크 추가 — 시점 스냅샷 저장
const addBookmark = async (req, res) => {
  const user_id = req.user.id;
  const { workflow_id } = req.body;

  if (!workflow_id)
    return res.status(400).json({ success: false, message: 'workflow_id는 필수입니다.' });

  try {
    const [wfRows] = await db.promise().query(
      'SELECT result_json FROM workflows WHERE id = ?', [workflow_id]
    );
    if (wfRows.length === 0)
      return res.status(404).json({ success: false, message: '워크플로우를 찾을 수 없습니다.' });

    const snapshot = typeof wfRows[0].result_json === 'string'
      ? wfRows[0].result_json
      : JSON.stringify(wfRows[0].result_json);

    await db.promise().query(
      'INSERT INTO workflow_bookmarks (user_id, workflow_id, custom_result_json) VALUES (?, ?, ?)',
      [user_id, workflow_id, snapshot]
    );

    return res.status(201).json({ success: true, message: '북마크가 추가되었습니다.' });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY')
      return res.status(409).json({ success: false, message: '이미 북마크한 워크플로우입니다.' });
    console.error('addBookmark error:', err);
    return res.status(500).json({ success: false, message: '서버 오류' });
  }
};

// 북마크 삭제
const removeBookmark = async (req, res) => {
  const user_id = req.user.id;
  const { workflow_id } = req.params;

  try {
    const [result] = await db.promise().query(
      'DELETE FROM workflow_bookmarks WHERE user_id = ? AND workflow_id = ?',
      [user_id, workflow_id]
    );
    if (result.affectedRows === 0)
      return res.status(404).json({ success: false, message: '북마크를 찾을 수 없습니다.' });

    return res.status(200).json({ success: true, message: '북마크가 삭제되었습니다.' });
  } catch (err) {
    console.error('removeBookmark error:', err);
    return res.status(500).json({ success: false, message: '서버 오류' });
  }
};

// 내 북마크 목록 조회
const getMyBookmarks = async (req, res) => {
  const user_id = req.user.id;

  try {
    const [results] = await db.promise().query(
      `SELECT w.id, w.title, w.user_input, w.created_at,
              wb.custom_result_json AS result_json,
              t.thumbnail, t.name AS tool_name, wtool.step_order,
              (SELECT GROUP_CONCAT(DISTINCT wtag.category_name)
               FROM workflow_tags wtag
               WHERE wtag.workflow_id = w.id) AS tags
       FROM workflow_bookmarks wb
       JOIN workflows w ON wb.workflow_id = w.id
       LEFT JOIN workflow_tools wtool ON w.id = wtool.workflow_id
       LEFT JOIN tools t ON wtool.tool_id = t.id
       WHERE wb.user_id = ?
       ORDER BY wb.created_at DESC, wtool.step_order ASC`,
      [user_id]
    );

    const workflowMap = {};
    results.forEach(row => {
      if (!workflowMap[row.id]) {
        workflowMap[row.id] = {
          id: row.id,
          title: row.title,
          result_json: typeof row.result_json === 'string'
            ? JSON.parse(row.result_json)
            : row.result_json,
          created_at: row.created_at,
          tags: row.tags ? row.tags.split(',') : [],
          tools: [],
        };
      }
      if (row.tool_name) {
        workflowMap[row.id].tools.push({
          name: row.tool_name,
          thumbnail: row.thumbnail,
        });
      }
    });

    return res.status(200).json({
      success: true,
      data: Object.values(workflowMap),
    });
  } catch (err) {
    console.error('getMyBookmarks error:', err);
    return res.status(500).json({ success: false, message: '서버 오류' });
  }
};

// 북마크 여부 확인
const checkBookmark = async (req, res) => {
  const user_id = req.user.id;
  const { workflow_id } = req.params;

  try {
    const [rows] = await db.promise().query(
      'SELECT id FROM workflow_bookmarks WHERE user_id = ? AND workflow_id = ?',
      [user_id, workflow_id]
    );
    return res.status(200).json({ success: true, data: { isBookmarked: rows.length > 0 } });
  } catch (err) {
    console.error('checkBookmark error:', err);
    return res.status(500).json({ success: false, message: '서버 오류' });
  }
};

// 북마크 프롬프트 수정 (내 복사본만 수정)
const updateBookmarkPrompt = async (req, res) => {
  const user_id = req.user.id;
  const { workflow_id } = req.params;
  const { result_json } = req.body;

  try {
    const [rows] = await db.promise().query(
      'SELECT id FROM workflow_bookmarks WHERE user_id = ? AND workflow_id = ?',
      [user_id, workflow_id]
    );
    if (rows.length === 0)
      return res.status(404).json({ success: false, message: '북마크를 찾을 수 없습니다.' });

    await db.promise().query(
      'UPDATE workflow_bookmarks SET custom_result_json = ? WHERE user_id = ? AND workflow_id = ?',
      [JSON.stringify(result_json), user_id, workflow_id]
    );

    return res.status(200).json({ success: true, message: '내 버전으로 저장되었습니다.' });
  } catch (err) {
    console.error('updateBookmarkPrompt error:', err);
    return res.status(500).json({ success: false, message: '서버 오류' });
  }
};

// 북마크 단건 조회
const getBookmarkByWorkflowId = async (req, res) => {
  const user_id = req.user.id;
  const { workflow_id } = req.params;

  try {
    const [rows] = await db.promise().query(
      `SELECT wb.custom_result_json, w.title, w.user_input,
              t.thumbnail, t.name AS tool_name, wtool.step_order
       FROM workflow_bookmarks wb
       JOIN workflows w ON wb.workflow_id = w.id
       LEFT JOIN workflow_tools wtool ON w.id = wtool.workflow_id
       LEFT JOIN tools t ON wtool.tool_id = t.id
       WHERE wb.user_id = ? AND wb.workflow_id = ?
       ORDER BY wtool.step_order ASC`,
      [user_id, workflow_id]
    );

    if (rows.length === 0)
      return res.status(404).json({ success: false, message: '북마크를 찾을 수 없습니다.' });

    const tools = rows.filter(r => r.tool_name).map(r => ({
      tool_name: r.tool_name,
      thumbnail: r.thumbnail,
    }));

    const resultJson = typeof rows[0].custom_result_json === 'string'
      ? JSON.parse(rows[0].custom_result_json)
      : rows[0].custom_result_json;

    return res.status(200).json({
      success: true,
      data: {
        title: rows[0].title,
        user_input: rows[0].user_input,
        result_json: resultJson,
        tools,
      },
    });
  } catch (err) {
    console.error('getBookmarkByWorkflowId error:', err);
    return res.status(500).json({ success: false, message: '서버 오류' });
  }
};

module.exports = { addBookmark, removeBookmark, getMyBookmarks, checkBookmark, updateBookmarkPrompt, getBookmarkByWorkflowId };