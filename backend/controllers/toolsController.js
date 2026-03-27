const db = require('../config/db');

// 툴 전체 목록 (카테고리 필터 포함)
const getTools = async (req, res) => {
    const {category_id} = req.query;

    let sql = `
    SELECT 
      t.id, t.name, t.free_plan, t.thumbnail, t.url,
      t.difficulty, t.rating, t.last_updated,
      JSON_ARRAYAGG(
        JSON_OBJECT(
          'category_id', c.id,
          'category_name', c.name,
          'description', tc.description,
          'desc_short', tc.desc_short, 
          'pros', tc.pros,
          'cons', tc.cons
        )
      ) AS categories
    FROM tools t
    LEFT JOIN tool_categories tc ON t.id = tc.tool_id
    LEFT JOIN categories c ON tc.category_id = c.id
  `;
    const params = [];

    if (category_id) {
        sql += ' WHERE tc.category_id = ?';
        params.push(category_id);
    }

    sql += ' GROUP BY t.id';

    try {
        const [results] = await db.promise().query(sql, params);
        return res.status(200).json({success: true, data: results});
    } catch (err) {
        console.error('getTools error:', err);
        return res.status(500).json({success: false, message: '서버 오류'});
    }
};

// 툴 상세 조회
const getToolById = async (req, res) => {
    const {id} = req.params;

    const sql = `
    SELECT 
      t.id, t.name, t.free_plan, t.thumbnail, t.url,
      t.difficulty, t.rating, t.last_updated,
      JSON_ARRAYAGG(
        JSON_OBJECT(
          'category_id', c.id,
          'category_name', c.name,
          'description', tc.description,
          'desc_short', tc.desc_short, 
          'pros', tc.pros,
          'cons', tc.cons
        )
      ) AS categories
    FROM tools t
    LEFT JOIN tool_categories tc ON t.id = tc.tool_id
    LEFT JOIN categories c ON tc.category_id = c.id
    WHERE t.id = ?
    GROUP BY t.id
  `;

    try {
        const [results] = await db.promise().query(sql, [id]);
        if (results.length === 0) {
            return res.status(404).json({success: false, message: '툴을 찾을 수 없습니다.'});
        }
        return res.status(200).json({success: true, data: results[0]});
    } catch (err) {
        console.error('getToolById error:', err);
        return res.status(500).json({success: false, message: '서버 오류'});
    }
};

module.exports = {getTools, getToolById};
