/**
 * ═══════════════════════════════════════════════
 * API Gateway - 요청 라우팅 + 인증/인가 (재구성)
 * ═══════════════════════════════════════════════
 *
 * 포트: 3001
 *
 * 서비스 라우팅 (9개 서비스):
 *   /api/v1/auth/**          → 인증 서비스 (3002)        - 일부 공개
 *   /api/v1/users/**         → 사용자 서비스 (3003)       - 인증 필요
 *   /api/v1/diagnoses/**     → 분석 서비스 (3004)        - 인증 필요
 *   /api/v1/content/**       → 콘텐츠 서비스 (3005)       - GET 공개 / 그 외 관리자
 *   /api/v1/hospitals/**     → 병원 탐색 서비스 (3006)    - 인증 필요
 *   /api/v1/feedbacks/**     → 피드백 서비스 (3007)       - 인증 필요
 *   /api/v1/admin/**         → 관리자 서비스 (3008)       - 관리자 전용
 *   /api/v1/monitoring/**    → 모니터링 서비스 (3009)     - 관리자 전용
 *   /api/v1/ai/**            → AI 진단 서버 (8001)        - 인증 필요 (내부 호출 위주)
 *
 * 인증/인가 전략:
 *   - Gateway 단에서 JWT 검증 후, 검증된 사용자 정보를
 *     x-user-id, x-user-email, x-user-role 헤더로 다운스트림에 전달
 *   - 다운스트림 서비스는 자체 인증 미들웨어를 그대로 유지하여 이중 검증 (defense-in-depth)
 */
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { createProxyMiddleware } = require("http-proxy-middleware");
const {
  authenticate,
  requireAdmin,
  optionalAuth,
  stripForgedHeaders,
} = require("./middleware/auth");

const app = express();
const port = process.env.PORT || 3001;
app.use(cors());

// 모든 요청 진입 시점에 클라이언트가 위조한 x-user-* 헤더 제거
// (인증 미들웨어를 거치지 않는 공개 경로에서도 안전성 보장)
app.use((req, _res, next) => {
  stripForgedHeaders(req);
  next();
});

// ─────────────────────────────────────────────
// 헬스체크 (인증 불필요)
// ─────────────────────────────────────────────
app.get("/health", (req, res) => {
  res.json({
    status: "UP",
    service: "api-gateway",
    timestamp: new Date().toISOString(),
  });
});

// ─────────────────────────────────────────────
// 프록시 미들웨어 빌더
// ─────────────────────────────────────────────
const buildProxy = (target, label) =>
  createProxyMiddleware({
    target,
    changeOrigin: true,
    onError: (err, req, res) => {
      console.error(`[gateway] ${label} → ${target} error:`, err.message);
      if (!res.headersSent) {
        res
          .status(503)
          .json({ success: false, message: `서비스에 연결할 수 없습니다: ${label}` });
      }
    },
  });

// ─────────────────────────────────────────────
// 서비스 타겟 URL
// ─────────────────────────────────────────────
const TARGETS = {
  auth: process.env.AUTH_SERVICE_URL || "http://localhost:3002",
  user: process.env.USER_SERVICE_URL || "http://localhost:3003",
  diagnosis: process.env.DIAGNOSIS_SERVICE_URL || "http://localhost:3004",
  content: process.env.CONTENT_SERVICE_URL || "http://localhost:3005",
  hospital: process.env.HOSPITAL_SERVICE_URL || "http://localhost:3006",
  feedback: process.env.FEEDBACK_SERVICE_URL || "http://localhost:3007",
  admin: process.env.ADMIN_SERVICE_URL || "http://localhost:3008",
  monitoring: process.env.MONITORING_SERVICE_URL || "http://localhost:3009",
  ai: process.env.AI_SERVICE_URL || "http://localhost:8001",
};

// ─────────────────────────────────────────────
// 1) /api/v1/auth - 인증 서비스
//    - register, login : 공개
//    - logout 등 그 외 : 인증 필요
// ─────────────────────────────────────────────
const authProxy = buildProxy(TARGETS.auth, "/api/v1/auth");

app.use("/api/v1/auth/register", authProxy);
app.use("/api/v1/auth/login", authProxy);
// 그 외 /api/v1/auth/* 는 인증 필요
app.use("/api/v1/auth", authenticate, authProxy);

// ─────────────────────────────────────────────
// 2) /api/v1/users - 사용자 서비스 (인증 필요)
// ─────────────────────────────────────────────
app.use("/api/v1/users", authenticate, buildProxy(TARGETS.user, "/api/v1/users"));

// ─────────────────────────────────────────────
// 3) /api/v1/diagnoses - 분석 서비스 (인증 필요)
//    공유 링크(예: /share/:token) 같은 공개 경로가 있다면 별도 처리
// ─────────────────────────────────────────────
const diagnosisProxy = buildProxy(TARGETS.diagnosis, "/api/v1/diagnoses");
// 공유 링크 조회는 비로그인도 가능하도록 optionalAuth 사용
app.use("/api/v1/diagnoses/share", optionalAuth, diagnosisProxy);
app.use("/api/v1/diagnoses", authenticate, diagnosisProxy);

// ─────────────────────────────────────────────
// 4) /api/v1/content - 콘텐츠 서비스
//    - GET (조회)  : 공개 (optionalAuth - 로그인 시 개인화 가능)
//    - POST/PUT/DELETE : 관리자 전용
// ─────────────────────────────────────────────
const contentProxy = buildProxy(TARGETS.content, "/api/v1/content");
app.use("/api/v1/content", (req, res, next) => {
  if (req.method === "GET") {
    return optionalAuth(req, res, () => contentProxy(req, res, next));
  }
  // 쓰기 작업은 관리자만
  return authenticate(req, res, () =>
    requireAdmin(req, res, () => contentProxy(req, res, next))
  );
});

// ─────────────────────────────────────────────
// 5) /api/v1/hospitals - 병원 탐색 서비스 (인증 필요)
// ─────────────────────────────────────────────
app.use("/api/v1/hospitals", authenticate, buildProxy(TARGETS.hospital, "/api/v1/hospitals"));

// ─────────────────────────────────────────────
// 6) /api/v1/feedbacks - 피드백 서비스 (인증 필요)
// ─────────────────────────────────────────────
app.use("/api/v1/feedbacks", authenticate, buildProxy(TARGETS.feedback, "/api/v1/feedbacks"));

// ─────────────────────────────────────────────
// 7) /api/v1/admin - 관리자 서비스 (관리자 전용)
// ─────────────────────────────────────────────
app.use(
  "/api/v1/admin",
  authenticate,
  requireAdmin,
  buildProxy(TARGETS.admin, "/api/v1/admin")
);

// ─────────────────────────────────────────────
// 8) /api/v1/monitoring - 모니터링 서비스 (관리자 전용)
// ─────────────────────────────────────────────
app.use(
  "/api/v1/monitoring",
  authenticate,
  requireAdmin,
  buildProxy(TARGETS.monitoring, "/api/v1/monitoring")
);

// ─────────────────────────────────────────────
// 9) /api/v1/ai - AI 진단 서버 (인증 필요)
// ─────────────────────────────────────────────
app.use("/api/v1/ai", authenticate, buildProxy(TARGETS.ai, "/api/v1/ai"));

// ─────────────────────────────────────────────
// 404 핸들러
// ─────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `API Gateway: ${req.method} ${req.originalUrl} 경로를 찾을 수 없습니다.`,
  });
});

app.listen(port, () => {
  console.log(`[api-gateway] running on port ${port}`);
  console.log(`[api-gateway] JWT 인증/인가 활성화`);
  Object.entries(TARGETS).forEach(([name, target]) =>
    console.log(`  → /api/v1/${name} → ${target}`)
  );
});
