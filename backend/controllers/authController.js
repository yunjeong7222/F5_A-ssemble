const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// 회원가입
const register = (req, res) => {
  const { email, password, nickname } = req.body;

  if (!email || !password || !nickname) {
    return res.status(400).json({ success: false, message: "이메일, 비밀번호, 닉네임은 필수입니다." });
  }

  // 이메일 중복 체크
  const checkSql = "SELECT id FROM users WHERE email = ?";
  db.query(checkSql, [email], (err, results) => {
    if (err) return res.status(500).json({ success: false, message: "서버 오류" });
    if (results.length > 0) {
      return res.status(409).json({ success: false, message: "이미 사용 중인 이메일입니다." });
    }

    // 비밀번호 해싱
    bcrypt.hash(password, 10, (err, hash) => {
      if (err) return res.status(500).json({ success: false, message: "서버 오류" });

      const insertSql = "INSERT INTO users (email, password_hash, nickname) VALUES (?, ?, ?)";
      db.query(insertSql, [email, hash, nickname], (err, result) => {
        if (err) return res.status(500).json({ success: false, message: "서버 오류" });
        return res.status(201).json({ success: true, message: "회원가입이 완료되었습니다." });
      });
    });
  });
};

// 로그인
const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: "이메일과 비밀번호를 입력해주세요." });
  }

  const sql = "SELECT * FROM users WHERE email = ?";
  db.query(sql, [email], (err, results) => {
    if (err) return res.status(500).json({ success: false, message: "서버 오류" });
    if (results.length === 0) {
      return res.status(401).json({ success: false, message: "이메일 또는 비밀번호가 올바르지 않습니다." });
    }

    const user = results[0];

    bcrypt.compare(password, user.password_hash, (err, isMatch) => {
      if (err) return res.status(500).json({ success: false, message: "서버 오류" });
      if (!isMatch) {
        return res.status(401).json({ success: false, message: "이메일 또는 비밀번호가 올바르지 않습니다." });
      }

      const token = jwt.sign(
        { id: user.id, email: user.email, nickname: user.nickname },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      return res.status(200).json({
        success: true,
        message: "로그인 성공",
        data: {
          token,
          user: {
            id: user.id,
            email: user.email,
            nickname: user.nickname,
            profile_img: user.profile_img,
          },
        },
      });
    });
  });
};

module.exports = { register, login };