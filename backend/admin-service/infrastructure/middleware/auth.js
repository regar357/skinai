const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "1234";

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "인증 토큰이 필요합니다." });
  }
  const token = authHeader.slice(7).trim();
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    req.token = token;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ success: false, message: "토큰이 만료되었습니다." });
    }
    return res.status(401).json({ success: false, message: "유효하지 않은 토큰입니다." });
  }
};

const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ success: false, message: "관리자 권한이 필요합니다." });
  }
  next();
};

module.exports = { authenticate, requireAdmin };
