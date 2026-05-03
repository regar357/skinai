/**
 * ═══════════════════════════════════════════════
 * JWT 인증 미들웨어 (인프라 계층)
 * ═══════════════════════════════════════════════
 * 
 * 역할: Authorization 헤더의 Bearer 토큰을 검증
 * - 검증 성공 시 req.user에 디코딩된 페이로드 주입
 * - 이후 컨트롤러에서 req.user.userId로 사용자 식별 가능
 */
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "1234";

const authenticate = (req, res, next) => {
  // Authorization 헤더에서 Bearer 토큰 추출
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "인증 토큰이 필요합니다." });
  }

  const token = authHeader.slice(7).trim();

  try {
    // 토큰 검증 → 성공 시 페이로드를 req.user에 주입
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;   // { userId, email, name, role }
    req.token = token;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ success: false, message: "토큰이 만료되었습니다." });
    }
    return res.status(401).json({ success: false, message: "유효하지 않은 토큰입니다." });
  }
};

module.exports = { authenticate };
