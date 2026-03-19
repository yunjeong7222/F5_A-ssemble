const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Redis } = require("@upstash/redis");

const SALT_ROUNDS = 10;
const REFRESH_TOKEN_TTL = 60 * 60 * 24 * 7; // 7일

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

// 회원가입
// POST /api/auth/register
const register = async (req, res) => {
  const { email, password, nickname } = req.body;

  if (!email || !password || !nickname) {
    return res.status(400).json({
      success: false,
      message: "이메일, 비밀번호, 닉네임은 필수입니다.",
    });
  }

  try {
    const [existing] = await db.promise().query(
      "SELECT email, nickname FROM users WHERE email = ? OR nickname = ?",
      [email, nickname]
    );

    if (existing.length > 0) {
      const isEmailDup = existing.some((u) => u.email === email);
      return res.status(409).json({
        success: false,
        message: isEmailDup
          ? "이미 사용 중인 이메일입니다."
          : "이미 사용 중인 닉네임입니다.",
      });
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    const [result] = await db.promise().query(
      "INSERT INTO users (email, password_hash, nickname) VALUES (?, ?, ?)",
      [email, passwordHash, nickname]
    );

    return res.status(201).json({
      success: true,
      message: "회원가입이 완료되었습니다.",
      data: { userId: result.insertId },
    });
  } catch (err) {
    console.error("register error:", err);
    return res.status(500).json({ success: false, message: "서버 오류" });
  }
};

// 로그인
// POST /api/auth/login
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "이메일과 비밀번호를 입력해주세요.",
    });
  }

  try {
    const [rows] = await db.promise().query(
      "SELECT id, email, password_hash, nickname, role FROM users WHERE email = ?",
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: "이메일 또는 비밀번호가 올바르지 않습니다.",
      });
    }

    const user = rows[0];

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "이메일 또는 비밀번호가 올바르지 않습니다.",
      });
    }

    const accessToken = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    const refreshToken = jwt.sign(
      { id: user.id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    // DB 저장 → Redis 저장으로 교체
    await redis.set(`refresh_token:${user.id}`, refreshToken, {
      ex: REFRESH_TOKEN_TTL,
    });

    return res.status(200).json({
      success: true,
      message: "로그인 성공",
      data: {
        accessToken,
        refreshToken,
        user: {
          id: user.id,
          email: user.email,
          nickname: user.nickname,
          role: user.role,
        },
      },
    });
  } catch (err) {
    console.error("login error:", err);
    return res.status(500).json({ success: false, message: "서버 오류" });
  }
};

// Access Token 재발급
// POST /api/auth/refresh
const refresh = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({
      success: false,
      message: "Refresh Token이 필요합니다.",
    });
  }

  try {
    // 1. JWT 서명 검증
    let decoded;
    try {
      decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: "유효하지 않은 Refresh Token입니다.",
      });
    }

    // DB 조회 → Redis 조회로 교체
    const storedToken = await redis.get(`refresh_token:${decoded.id}`);

    // 저장된 토큰이 없거나 요청 토큰과 다르면 탈취 가능성 → Redis 키 삭제
    if (!storedToken || storedToken !== refreshToken) {
      await redis.del(`refresh_token:${decoded.id}`);
      return res.status(401).json({
        success: false,
        message: "유효하지 않은 Refresh Token입니다. 다시 로그인해주세요.",
      });
    }

    // 3. 유저 조회
    const [users] = await db.promise().query(
      "SELECT id, email, role FROM users WHERE id = ?",
      [decoded.id]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: "유저를 찾을 수 없습니다.",
      });
    }

    const user = users[0];

    // 4. 새 토큰 발급
    const newAccessToken = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    const newRefreshToken = jwt.sign(
      { id: user.id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    // DB 저장 → Redis 갱신으로 교체 (기존 키 덮어쓰기)
    await redis.set(`refresh_token:${user.id}`, newRefreshToken, {
      ex: REFRESH_TOKEN_TTL,
    });

    return res.status(200).json({
      success: true,
      message: "Access Token이 재발급되었습니다.",
      data: {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      },
    });
  } catch (err) {
    console.error("refresh error:", err);
    return res.status(500).json({ success: false, message: "서버 오류" });
  }
};

// 로그아웃
// POST /api/auth/logout
const logout = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({
      success: false,
      message: "Refresh Token이 필요합니다.",
    });
  }

  try {
    // JWT에서 userId 추출 후 Redis 키 삭제
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    await redis.del(`refresh_token:${decoded.id}`);

    return res.status(200).json({ success: true, message: "로그아웃 되었습니다." });
  } catch (err) {
    // 토큰이 만료됐어도 로그아웃은 성공 처리
    return res.status(200).json({ success: true, message: "로그아웃 되었습니다." });
  }
};

// 로그인 유지
// GET /api/users/me
const getMe = async (req, res) => {
  try {
    const [rows] = await db.promise().query(
      "SELECT id, email, nickname, role FROM users WHERE id = ?",
      [req.user.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "유저를 찾을 수 없습니다.",
      });
    }
    return res.status(200).json({ success: true, data: rows[0] });
  } catch (err) {
    console.error("getMe error:", err);
    return res.status(500).json({ success: false, message: "서버 오류" });
  }
};

module.exports = { register, login, getMe, refresh, logout};