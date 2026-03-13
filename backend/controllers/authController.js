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
    // 이메일 중복 체크
    const [existingUser] = await db.promise().query(
      "SELECT id FROM users WHERE email = ?",
      [email]  // ? 자리에 들어갈 값 - Prepared Statement로 SQL Injection 방지
    );
    if (existingUser.length > 0) {
      return res.status(409).json({  // 409 Conflict
        success: false,
        message: "이미 사용 중인 이메일입니다.",
      });
    }

    // 닉네임 중복 체크 - 안하면 DB에서 에러
    const [existingNickname] = await db.promise().query(
      "SELECT id FROM users WHERE nickname = ?",
      [nickname]
    );
    if (existingNickname.length > 0) {
      return res.status(409).json({
        success: false,
        message: "이미 사용 중인 닉네임입니다.",
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
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" } 
    );

    // 응답 반환
    return res.status(200).json({
      success: true,
      message: "로그인 성공",
      data: {
        token,
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


module.exports = { register, login, getMe }; // 라우터에서 사용할 수 있도록 내보내기     