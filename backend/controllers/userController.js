const db = require('../config/db');
const bcrypt = require('bcrypt');

const updateProfile = async (req, res, next) => {
  try {
    const { profile_url, bio } = req.body;
    const userId = req.user.id;

    await db.query(
      'UPDATE users SET profile_url = ?, bio = ? WHERE id = ?',
      [profile_url, bio, userId]
    );

    const [rows] = await db.query(
      'SELECT id, email, nickname, profile_url, bio FROM users WHERE id = ?',
      [userId]
    );

    res.json({ success: true, data: rows[0], message: '프로필이 업데이트되었습니다.' });
  } catch (err) {
    next(err);
  }
};

const updatePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    const [rows] = await db.query('SELECT password_hash FROM users WHERE id = ?', [userId]);
    const isMatch = await bcrypt.compare(currentPassword, rows[0].password_hash);

    if (!isMatch) {
      const err = new Error('현재 비밀번호가 올바르지 않습니다.');
      err.status = 401;
      throw err;
    }

    if (newPassword.length < 8) {
      const err = new Error('비밀번호는 8자 이상이어야 합니다.');
      err.status = 400;
      throw err;
    }

    const password_hash = await bcrypt.hash(newPassword, 10);
    await db.query('UPDATE users SET password_hash = ? WHERE id = ?', [password_hash, userId]);

    res.json({ success: true, message: '비밀번호가 변경되었습니다.' });
  } catch (err) {
    next(err);
  }
};

const deleteAccount = async (req, res, next) => {
  try {
    const userId = req.user.id;
    await db.query('DELETE FROM users WHERE id = ?', [userId]);
    res.json({ success: true, message: '계정이 삭제되었습니다.' });
  } catch (err) {
    next(err);
  }
};

module.exports = { updateProfile, updatePassword, deleteAccount };