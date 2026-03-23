const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "인증 헤더가 없거나 형식이 올바르지 않습니다.",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { id, email, role } = decoded;
    req.user = { id, email, role };
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "토큰이 만료되었습니다. 다시 로그인해주세요.",
      });
    }
    return res.status(403).json({
      success: false,
      message: "유효하지 않은 토큰입니다.",
    });
  }
};

const optionalAuth = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) return next();
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { id, email, role } = decoded;
    req.user = { id, email, role };
  } catch {
    // 토큰 오류여도 통과
  }
  next();
};

module.exports = { authMiddleware, optionalAuth };