/**
 * ═══════════════════════════════════════════════
 * API Gateway - 요청 라우팅 + 인증/인가
 * ═══════════════════════════════════════════════
 *
 * 포트: 3001
 *
 * 서비스 라우팅 (프론트엔드 양식 정합):
 *   /api/v1/auth/**          → auth-service (3002)
 *     - signup, login          공개
 *     - 그 외                  인증 필요
 *
 *   /api/v1/users/**         → user-service (3003)        - 인증 필요
 *
 *   /api/v1/diagnoses/**     → diagnosis-service (3004)   - 인증 필요
 *     - 단, /shared/:token     공개 (optionalAuth)
 *
 *   /api/v1/notices/**       → content-service (3005)
 *     - GET                    공개
 *     - POST/PUT/DELETE        관리자 전용
 *   /api/v1/encyclopedia/**  → content-service (3005)
 *     - GET                    공개
 *     - POST/PUT/DELETE        관리자 전용
 *   /api/v1/content/**       → content-service (3005)     - (호환용)
 *
 *   /api/v1/hospitals/**     → hospital-service (3006)    - 인증 필요
 *
 *   /api/v1/feedback/**      → feedback-service (3007)    - 인증 필요
 *
 *   /api/v1/admin/**         → admin-service (3008)
 *     - /admin/login           공개 (관리자 로그인)
 *     - 그 외                  관리자 전용
 *
 *   /api/v1/monitoring/**    → monitoring-service (3009)  - 관리자 전용
 *
 *   /api/v1/ai/**            → AI 진단 서버 (8001)         - 인증 필요
 *
 * 인증/인가 전략:
 *   - Gateway 단에서 JWT 검증 후, 사용자 정보를
 *     x-user-id, x-user-email, x-user-role 헤더로 다운스트림에 전달
 *   - 다운스트림 서비스도 자체 인증 미들웨어를 유지 (defense-in-depth)
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

app.use((req, _res, next) => {
  stripForgedHeaders(req);
  next();
});

app.get("/health", (req, res) => {
  res.json({
    status: "UP",
    service: "api-gateway",
    timestamp: new Date().toISOString(),
  });
});

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

// 프록시 빌더 - 원본 URL 그대로 전달
const buildProxy = (target, label) =>
  createProxyMiddleware({
    target,
    changeOrigin: true,
    // 핵심: app.use 가 prefix 를 떼지 않도록 우회
    pathRewrite: (path, req) => req.originalUrl,
    onError: (err, req, res) => {
      console.error(`[gateway] ${label} -> ${target} error:`, err.message);
      if (!res.headersSent) {
        res
          .status(503)
          .json({ success: false, message: `서비스 연결 실패: ${label}` });
      }
    },
  });

// auth: signup, login 공개 / 그 외 인증
const authProxy = buildProxy(TARGETS.auth, "auth");
app.use("/api/v1/auth", (req, res, next) => {
  if (req.path === "/signup" || req.path === "/login") {
    return authProxy(req, res, next);
  }
  return authenticate(req, res, () => authProxy(req, res, next));
});

// users: 인증 필요
app.use("/api/v1/users", authenticate, buildProxy(TARGETS.user, "user"));

// diagnoses: shared 만 공개
const diagnosisProxy = buildProxy(TARGETS.diagnosis, "diagnosis");
app.use("/api/v1/diagnoses", (req, res, next) => {
  if (req.path.startsWith("/shared")) {
    return optionalAuth(req, res, () => diagnosisProxy(req, res, next));
  }
  return authenticate(req, res, () => diagnosisProxy(req, res, next));
});

// content/notices/encyclopedia: GET 공개, 그 외 관리자
const contentProxy = buildProxy(TARGETS.content, "content");
const contentAccess = (req, res, next) => {
  if (req.method === "GET") {
    return optionalAuth(req, res, () => contentProxy(req, res, next));
  }
  return authenticate(req, res, () =>
    requireAdmin(req, res, () => contentProxy(req, res, next)),
  );
};
app.use("/api/v1/notices", contentAccess);
app.use("/api/v1/encyclopedia", contentAccess);
app.use("/api/v1/diseases", contentAccess);
app.use("/api/v1/content", contentAccess);

// hospitals: 인증
app.use(
  "/api/v1/hospitals",
  authenticate,
  buildProxy(TARGETS.hospital, "hospital"),
);

// feedback: 인증
app.use(
  "/api/v1/feedback",
  authenticate,
  buildProxy(TARGETS.feedback, "feedback"),
);

// admin: 전체 관리자 전용
app.use("/api/v1/admin", authenticate, requireAdmin, buildProxy(TARGETS.admin, "admin"));

// monitoring: 관리자
app.use(
  "/api/v1/monitoring",
  authenticate,
  requireAdmin,
  buildProxy(TARGETS.monitoring, "monitoring"),
);

// ai: 인증
app.use("/api/v1/ai", authenticate, buildProxy(TARGETS.ai, "ai"));

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
    console.log(`  -> /api/v1/${name} -> ${target}`),
  );
});
