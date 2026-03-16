const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const SALT_ROUNDS = 10;

// 회원가입
// post  /api/auth/register
const register = async (req, res) => {
  const { email, password, nickname } = req.body;
  // 필수값 검증
  if (!email || !password || !nickname) {
    return res.status(400).json({ 
      success: false, 
      message: "이메일, 비밀번호, 닉네임은 필수입니다."
    });
  }

  try {
    // 이메일/닉네임 중복 체크를 한 번의 쿼리로 병렬 처리하면 더 빠름
    const [existing] = await db.promise().query(
      "SELECT email, nickname FROM users WHERE email = ? OR nickname = ?",
      [email, nickname]
    );

    if (existing.length > 0) {
      const isEmailDup = existing.some(u => u.email === email);
      return res.status(409).json({
        success: false,
        message: isEmailDup ? "이미 사용 중인 이메일입니다." : "이미 사용 중인 닉네임입니다.",
      });
    }

    // 비밀번호 해싱
    // bcrypt.hash(평문, saltRounds) → 암호화된 문자열 반환
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    // 유저 DB 저장
    const [result] = await db.promise().query(
      "INSERT INTO users (email, password_hash, nickname) VALUES (?, ?, ?)",
      [email, passwordHash, nickname]
    );

    // insertId = 방금 INSERT된 행의 AUTO_INCREMENT id값
    return res.status(201).json({  // 201 Created
      success: true,
      message: "회원가입이 완료되었습니다.",
      data: { userId: result.insertId },
    });

  } catch (err) {
    // DB 연결 실패, 쿼리 오류 등 예상치 못한 에러는 여기서 처리
    console.error("register error:", err);
    return res.status(500).json({ success: false, message: "서버 오류" });
  }
};


// 로그인
// POST /api/auth/login
const login = async (req, res) => {
  const { email, password } = req.body;

  // 필수값 검증
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "이메일과 비밀번호를 입력해주세요.",
    });
  }

  try {
    // 이메일로 유저 조회
    // SELECT * 대신 필요한 컬럼만 명시
    const [rows] = await db.promise().query(
      "SELECT id, email, password_hash, nickname, role FROM users WHERE email = ?",
      [email]
    );

    // 이메일 존재 여부 확인 -> 열거 공격(Enumeration Attack) 방지
    //   (공격자가 이메일 존재 여부를 알 수 없게 함)
    if (rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: "이메일 또는 비밀번호가 올바르지 않습니다.",
      });
    }

    const user = rows[0];

    // 비밀번호 검증
    // bcrypt.compare(입력한 평문, DB에 저장된 해시) → true/false
    // 해시는 복호화가 불가능하기 때문에 compare로만 검증 가능
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "이메일 또는 비밀번호가 올바르지 않습니다.",
      });
    }

    // JWT 발급
    // authMiddleware에서 똑같이 { id, email, role } 추출하므로 반드시 일치해야 함
    const accessToken  = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" } 
    );

    // Refresh Token 발급 (7d)
    const refreshToken = jwt.sign(
      { id: user.id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    // Refresh Token DB 저장
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7일 후
    await db.promise().query(
      "INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES (?, ?, ?)",
      [user.id, refreshToken, expiresAt]
    );

    // 응답 반환
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
          // password_hash 의도적으로 제외
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
    return res.status(400).json({ success: false, message: "Refresh Token이 필요합니다." });
  }

  try {
    // 1. JWT 서명 검증
    let decoded;
    try {
      decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);  //jwt.verify(검증할토큰, 서명에사용한시크릿) 
    } catch (err) {
      return res.status(401).json({ success: false, message: "유효하지 않은 Refresh Token입니다." });
    }

    // 2. DB에서 토큰 존재 여부 + 만료 + 폐기 여부 확인
    const [rows] = await db.promise().query(
      `SELECT id FROM refresh_tokens 
       WHERE token = ? 
         AND is_revoked = FALSE 
         AND expires_at > NOW()`,
      [refreshToken]
    );

    // 이미 폐기된 토큰으로 요청 시 → 탈취 가능성 → 해당 유저 토큰 전체 폐기
    if (rows.length === 0) {
      await db.promise().query(
        "UPDATE refresh_tokens SET is_revoked = TRUE WHERE user_id = ?",
        [decoded.id]
      );
      return res.status(401).json({ success: false, message: "유효하지 않은 Refresh Token입니다. 다시 로그인해주세요." });
    }

    // 3. 유저 조회
    const [users] = await db.promise().query(
      "SELECT id, email, role FROM users WHERE id = ?",
      [decoded.id]
    );

    if (users.length === 0) {
      return res.status(404).json({ success: false, message: "유저를 찾을 수 없습니다." });
    }

    const user = users[0];

    // 4. 기존 Refresh Token 폐기
    await db.promise().query(
      "UPDATE refresh_tokens SET is_revoked = TRUE WHERE token = ?",
      [refreshToken]
    );

    // 5. 새 Access Token 발급
    const newAccessToken = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // 6. 새 Refresh Token 발급 + DB 저장
    const newRefreshToken = jwt.sign(
      { id: user.id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await db.promise().query(
      "INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES (?, ?, ?)",
      [user.id, newRefreshToken, expiresAt]
    );

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


// 로그아웃 (Refresh Token 폐기)
// POST /api/auth/logout
const logout = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ success: false, message: "Refresh Token이 필요합니다." });
  }

  try {
    await db.promise().query(
      "UPDATE refresh_tokens SET is_revoked = TRUE WHERE token = ?",
      [refreshToken]
    );

    return res.status(200).json({ success: true, message: "로그아웃 되었습니다." });
  } catch (err) {
    console.error("logout error:", err);
    return res.status(500).json({ success: false, message: "서버 오류" });
  }
};

// 로그인 유지 시
const getMe = async (req, res) => {
  try {
    const [rows] = await db.promise().query(
      "SELECT id, email, nickname, role FROM users WHERE id = ?",
      [req.user.id] // authMiddleware에서 주입된 값
    );
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: "유저를 찾을 수 없습니다." });
    }
    return res.status(200).json({ success: true, data: rows[0] });
  } catch (err) {
    console.error("getMe error:", err);
    return res.status(500).json({ success: false, message: "서버 오류" });
  }
};


module.exports = { register, login, getMe, refresh, logout }; // 라우터에서 사용할 수 있도록 내보내기     
