const db = require("../config/db");

// 워크플로우 생성
const createWorkflow = async (req, res) => {
  const { user_input, result_json, title, tool_ids } = req.body;
  const user_id = req.user ? req.user.id : null;

  if (!user_input || !result_json) {
    return res.status(400).json({
      success: false,
      message: "user_input과 result_json은 필수입니다.",
    });
  }

  try {
    const workflows_category = result_json?.steps?.[0]?.workflows_category || null;

    const [result] = await db.promise().query(
      "INSERT INTO workflows (user_id, user_input, result_json, title, workflows_category) VALUES (?, ?, ?, ?, ?)",
      [user_id, user_input, JSON.stringify(result_json), title, workflows_category]
    );

    const workflowId = result.insertId;

    if (!tool_ids || tool_ids.length === 0) {
      return res.status(201).json({
        success: true,
        message: "워크플로우 생성 완료",
        data: { id: workflowId },
      });
    }

    const toolValues = tool_ids.map((tool_id, index) => [workflowId, tool_id, index + 1]);
    await db.promise().query(
      "INSERT INTO workflow_tools (workflow_id, tool_id, step_order) VALUES ?",
      [toolValues]
    );

    return res.status(201).json({
      success: true,
      message: "워크플로우 생성 완료",
      data: { id: workflowId },
    });
  } catch (err) {
    console.error("createWorkflow error:", err);
    return res.status(500).json({ success: false, message: "서버 오류" });
  }
};

// 워크플로우 상세 조회
const getWorkflowById = async (req, res) => {
  const { id } = req.params;

  try {
    const [results] = await db.promise().query(
      `SELECT w.*, 
        t.id AS tool_id, t.name AS tool_name, t.thumbnail, t.url, tc.pros, tc.cons, 
        wt.step_order
      FROM workflows w
      LEFT JOIN workflow_tools wt ON w.id = wt.workflow_id
      LEFT JOIN tools t ON wt.tool_id = t.id
      LEFT JOIN tool_categories tc ON t.id = tc.tool_id
      WHERE w.id = ?
      ORDER BY wt.step_order`,
      [id]
    );

    if (results.length === 0) {
      return res.status(404).json({
        success: false,
        message: "워크플로우를 찾을 수 없습니다.",
      });
    }

    // 워크플로우 정보 + 툴 목록 분리
    const workflow = {
      id: results[0].id,
      user_id: results[0].user_id,
      user_input: results[0].user_input,
      result_json: results[0].result_json,
      title: results[0].title,
      created_at: results[0].created_at,
      tools: results
        .filter((r) => r.tool_id)
        .map((r) => ({
          step_order: r.step_order,
          tool_id: r.tool_id,
          tool_name: r.tool_name,
          thumbnail: r.thumbnail,
          url: r.url,
          pros: r.pros,          
          cons: r.cons, 
        })),
    };

    return res.status(200).json({ success: true, data: workflow });
  } catch (err) {
    console.error("getWorkflowById error:", err);
    return res.status(500).json({ success: false, message: "서버 오류" });
  }
};

const getMyWorkflows = async (req, res) => {
  const user_id = req.user.id;

  try {
    const [results] = await db.promise().query(
      `SELECT w.id, w.title, w.user_input, w.result_json, w.created_at, w.workflows_category,
              t.thumbnail, t.name AS tool_name, wt.step_order
       FROM workflows w
       LEFT JOIN workflow_tools wt ON w.id = wt.workflow_id
       LEFT JOIN tools t ON wt.tool_id = t.id
       WHERE w.user_id = ?
       ORDER BY w.created_at DESC, wt.step_order ASC`,
      [user_id]
    );

    const workflowMap = {};
    results.forEach(row => {
      if (!workflowMap[row.id]) {
        workflowMap[row.id] = {
          id: row.id,
          title: row.title || row.user_input,
          result_json: row.result_json,
          created_at: row.created_at,
          workflows_category: row.workflows_category,
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
    console.error("getMyWorkflows error:", err);
    return res.status(500).json({ success: false, message: "서버 오류" });
  }
};

const deleteWorkflow = async (req, res) => {
  const { id } = req.params;
  const user_id = req.user.id;

  try {
    // 본인 워크플로우인지 확인
    const [rows] = await db.promise().query(
      'SELECT user_id FROM workflows WHERE id = ?', [id]
    );
    if (rows.length === 0) return res.status(404).json({ success: false, message: '워크플로우를 찾을 수 없습니다.' });
    if (rows[0].user_id !== user_id) return res.status(403).json({ success: false, message: '삭제 권한이 없습니다.' });

    await db.promise().query('DELETE FROM workflows WHERE id = ?', [id]);

    return res.status(200).json({ success: true, message: '워크플로우가 삭제되었습니다.' });
  } catch (err) {
    console.error('deleteWorkflow error:', err);
    return res.status(500).json({ success: false, message: '서버 오류' });
  }
};

module.exports = { createWorkflow, getWorkflowById, getMyWorkflows, deleteWorkflow };