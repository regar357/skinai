const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "1234";

const extractToken = (req) => {
  const authHeader =
    req.headers.authorization || req.body.token || req.query.token;
  if (!authHeader || typeof authHeader !== "string") return null;
  if (authHeader.startsWith("Bearer ")) {
    return authHeader.slice(7).trim();
  }
  return authHeader.trim();
};

exports.requireAuth = (req, res, next) => {
  const token = extractToken(req);
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "JWT 토큰이 필요합니다.",
    });
  }

  try {
    jwt.verify(token, JWT_SECRET);
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "유효하지 않은 JWT 토큰입니다.",
    });
  }
};
