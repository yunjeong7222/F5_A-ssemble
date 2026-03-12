const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
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
    const { id, email, role } = decoded; // 필요한 필드만 추출
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