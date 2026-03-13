const db = require("../config/db");

const getCategories = async (req, res) => {
  try {
    const [results] = await db.promise().query(
      "SELECT * FROM categories ORDER BY display_order"
    );
    return res.status(200).json({ success: true, data: results });
  } catch (err) {
    console.error("getCategories error:", err);
    return res.status(500).json({ success: false, message: "서버 오류" });
  }
};

module.exports = { getCategories };