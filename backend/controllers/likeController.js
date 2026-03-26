const db = require('../config/db');

// 좋아요
// POST /likes/:id/likes
const likePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    await db.promise().query(
      'INSERT IGNORE INTO likes (user_id, post_id) VALUES (?, ?)',
      [userId, id]
    );

    return res.status(200).json({ success: true, message: '좋아요를 눌렀습니다.' });
  } catch (err) {
    next(err);
  }
};

// 좋아요 취소
// DELETE /likes/:id/likes
const unlikePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    await db.promise().query(
      'DELETE FROM likes WHERE user_id = ? AND post_id = ?',
      [userId, id]
    );

    return res.status(200).json({ success: true, message: '좋아요를 취소했습니다.' });
  } catch (err) {
    next(err);
  }
};

module.exports = { likePost, unlikePost };