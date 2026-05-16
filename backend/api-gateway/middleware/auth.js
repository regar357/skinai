/**
 * ═══════════════════════════════════════════════
 * API Gateway - JWT 인증 미들웨어
 * ═══════════════════════════════════════════════
 *
 * 기능:
 *   1. authenticate     - JWT 토큰 검증 (사용자/관리자 공통)
 *   2. requireAdmin     - 관리자(role=admin) 권한 확인
 *   3. requireUser      - 일반 사용자(role=user) 권한 확인 (필요 시)
 *   4. optionalAuth     - 토큰이 있으면 검증, 없어도 통과 (공개 + 개인화 혼합 경로용)
 *
 * 검증된 사용자 정보는 다운스트림 서비스에 헤더로 전달됩니다:
 *   x-user-id    : 사용자 ID
 *   x-user-email : 이메일
 *   x-user-role  : 권한 (user | admin)
 *
 * JWT payload 구조 (auth-service에서 발급):
 *   { userId, email, role, iat, exp }
 */
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "1234";

/**
 * 요청 헤더에서 Bearer 토큰 추출
 */
function extractToken(req) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) return null;
  return authHeader.slice(7).trim();
}

/**
 * 검증된 사용자 정보를 다운스트림 서비스로 전달하기 위해
 * req 객체에 저장하고, 헤더에도 주입한다.
 *
 * - req.user            : 컨트롤러에서 사용
 * - req.headers["x-*"]  : http-proxy-middleware가 그대로 전달
 *
 * 보안 주의: 클라이언트가 위조한 x-user-* 헤더는 항상 덮어쓴다.
 */
function attachUserContext(req, decoded) {
  req.user = decoded;
  req.headers["x-user-id"] = String(decoded.userId);
  req.headers["x-user-email"] = decoded.email || "";
  req.headers["x-user-role"] = decoded.role || "user";
}

/**
 * 클라이언트가 보낸 위조된 인증 헤더 제거 (Gateway 진입 시 항상 호출)
 */
function stripForgedHeaders(req) {
  delete req.headers["x-user-id"];
  delete req.headers["x-user-email"];
  delete req.headers["x-user-role"];
}

/**
 * 1. authenticate
 * - JWT 토큰을 검증하고 사용자 정보를 req.user 및 헤더에 주입
 * - 토큰이 없거나 유효하지 않으면 401 응답
 */
const authenticate = (req, res, next) => {
  stripForgedHeaders(req);

  const token = extractToken(req);
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "인증 토큰이 필요합니다.",
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    attachUserContext(req, decoded);
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "토큰이 만료되었습니다. 다시 로그인해주세요.",
      });
    }
    return res.status(401).json({
      success: false,
      message: "유효하지 않은 토큰입니다.",
    });
  }
};

/**
 * 2. requireAdmin
 * - authenticate 이후에 사용
 * - role !== "admin" 이면 403 응답
 */
const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "인증이 필요합니다.",
    });
  }
  if (req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "관리자 권한이 필요합니다.",
    });
  }
  next();
};

/**
 * 3. requireUser
 * - 일반 사용자 전용 경로 보호용 (관리자도 차단하고 싶을 때)
 * - 대부분의 경우 authenticate 만으로 충분하지만,
 *   "내 진단 내역", "내 피드백" 같이 개인 단위 리소스에서 admin 계정의 우회를 막고 싶을 때 사용
 */
const requireUser = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "인증이 필요합니다.",
    });
  }
  if (req.user.role !== "user") {
    return res.status(403).json({
      success: false,
      message: "일반 사용자 전용 기능입니다.",
    });
  }
  next();
};

/**
 * 4. optionalAuth
 * - 토큰이 있으면 검증해서 사용자 정보를 주입
 * - 토큰이 없거나 잘못되어도 다음 미들웨어로 진행 (공개 경로 + 개인화 혼합 시 사용)
 *   예) 피부백과 조회 - 비로그인도 가능, 로그인 시 북마크 표시
 */
const optionalAuth = (req, res, next) => {
  stripForgedHeaders(req);

  const token = extractToken(req);
  if (!token) return next();

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    attachUserContext(req, decoded);
  } catch (_error) {
    // 토큰이 잘못되어도 통과 (단, 사용자 정보는 주입하지 않음)
  }
  next();
};

module.exports = {
  authenticate,
  requireAdmin,
  requireUser,
  optionalAuth,
  stripForgedHeaders,
};
