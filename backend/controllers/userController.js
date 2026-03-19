const db = require('../config/db');
const bcrypt = require('bcrypt');

const updateProfile = async (req, res, next) => {
  try {
    const { profile_url, bio, nickname } = req.body; 
    const userId = req.user.id;

    // 닉네임 변경 시 중복 체크
    if (nickname) {
      const [existing] = await db.promise().query(
        'SELECT id FROM users WHERE nickname = ? AND id != ?',
        [nickname, userId]
      );
      if (existing.length > 0) {
        const err = new Error('이미 사용 중인 닉네임입니다.');
        err.status = 409;
        throw err;
      }
    }

    await db.promise().query(
      'UPDATE users SET profile_url = ?, bio = ?, nickname = COALESCE(?, nickname) WHERE id = ?',
      [profile_url, bio, nickname ?? null, userId]
    );

    const [rows] = await db.promise().query(
      'SELECT id, email, nickname, profile_url, bio FROM users WHERE id = ?',
      [userId]
    );

    res.json({ success: true, data: rows[0], message: '프로필이 업데이트되었습니다.' });
  } catch (err) {
    next(err);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { email, nickname, newPassword } = req.body;

    if (!email || !nickname || !newPassword) {
      const err = new Error('이메일, 닉네임, 새 비밀번호는 필수입니다.');
      err.status = 400;
      throw err;
    }

    if (newPassword.length < 8) {
      const err = new Error('비밀번호는 8자 이상이어야 합니다.');
      err.status = 400;
      throw err;
    }

    // 이메일 + 닉네임 일치 확인
    const [rows] = await db.promise().query(
      'SELECT id FROM users WHERE email = ? AND nickname = ?',
      [email, nickname]
    );

    if (rows.length === 0) {
      const err = new Error('이메일 또는 닉네임이 올바르지 않습니다.');
      err.status = 401;
      throw err;
    }

    const password_hash = await bcrypt.hash(newPassword, 10);
    await db.promise().query(
      'UPDATE users SET password_hash = ? WHERE id = ?',
      [password_hash, rows[0].id]
    );

    res.json({ success: true, message: '비밀번호가 변경되었습니다.' });
  } catch (err) {
    next(err);
  }
};

const updatePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    // ✅ 검증 먼저, DB 조회 나중에
    if (!newPassword || newPassword.length < 8) {
      const err = new Error('비밀번호는 8자 이상이어야 합니다.');
      err.status = 400;
      throw err;
    }

    if (currentPassword === newPassword) {
      const err = new Error('새 비밀번호는 현재 비밀번호와 달라야 합니다.');
      err.status = 400;
      throw err;
    }

    const [rows] = await db.promise().query('SELECT password_hash FROM users WHERE id = ?', [userId]);
    const isMatch = await bcrypt.compare(currentPassword, rows[0].password_hash);

    if (!isMatch) {
      const err = new Error('현재 비밀번호가 올바르지 않습니다.');
      err.status = 401;
      throw err;
    }

    const password_hash = await bcrypt.hash(newPassword, 10);
    await db.promise().query('UPDATE users SET password_hash = ? WHERE id = ?', [password_hash, userId]);

    res.json({ success: true, message: '비밀번호가 변경되었습니다.' });
  } catch (err) {
    next(err);
  }
};

const deleteAccount = async (req, res, next) => {
  try {
    const { password } = req.body; // ✅ 비밀번호 재확인 추가
    const userId = req.user.id;

    if (!password) {
      const err = new Error('비밀번호를 입력해주세요.');
      err.status = 400;
      throw err;
    }

    const [rows] = await db.promise().query('SELECT password_hash FROM users WHERE id = ?', [userId]);
    const isMatch = await bcrypt.compare(password, rows[0].password_hash);

    if (!isMatch) {
      const err = new Error('비밀번호가 올바르지 않습니다.');
      err.status = 401;
      throw err;
    }

    await db.promise().query('DELETE FROM users WHERE id = ?', [userId]);
    res.json({ success: true, message: '계정이 삭제되었습니다.' });
  } catch (err) {
    next(err);
  }
};

module.exports = { updateProfile, resetPassword, updatePassword, deleteAccount };