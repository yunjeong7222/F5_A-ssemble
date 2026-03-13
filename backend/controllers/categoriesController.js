const db = require("../config/db");

const getCategories = (req, res) => {
  db.query("SELECT * FROM categories ORDER BY display_order", (err, results) => {
    if (err) return res.status(500).json({ success: false, message: "서버 오류" });
    return res.status(200).json({ success: true, data: results });
  });
};

module.exports = { getCategories };