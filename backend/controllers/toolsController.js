const db = require("../config/db");

// 툴 전체 목록 (카테고리 필터 포함)
const getTools = (req, res) => {
  const { category_id } = req.query;

  let sql = `
    SELECT t.*, c.name AS category_name
    FROM tools t
    LEFT JOIN tool_categories tc ON t.id = tc.tool_id
    LEFT JOIN categories c ON tc.category_id = c.id
  `;
  const params = [];

  if (category_id) {
    sql += " WHERE tc.category_id = ?";
    params.push(category_id);
  }

  db.query(sql, params, (err, results) => {
    if (err) return res.status(500).json({ success: false, message: "서버 오류" });
    return res.status(200).json({ success: true, data: results });
  });
};

// 툴 상세 조회
const getToolById = (req, res) => {
  const { id } = req.params;

  const sql = `
    SELECT t.*, c.name AS category_name, tc.description, tc.pros, tc.cons
    FROM tools t
    LEFT JOIN tool_categories tc ON t.id = tc.tool_id
    LEFT JOIN categories c ON tc.category_id = c.id
    WHERE t.id = ?
  `;

  db.query(sql, [id], (err, results) => {
    if (err) return res.status(500).json({ success: false, message: "서버 오류" });
    if (results.length === 0) {
      return res.status(404).json({ success: false, message: "툴을 찾을 수 없습니다." });
    }
    return res.status(200).json({ success: true, data: results[0] });
  });
};

module.exports = { getTools, getToolById };