/**
 * ═══════════════════════════════════════════════
 * API Gateway - 요청 라우팅 (재구성)
 * ═══════════════════════════════════════════════
 * 
 * 포트: 3001
 * 
 * 서비스 라우팅 (9개 서비스):
 *   /api/auth/**          → 인증 서비스 (3002)
 *   /api/users/**         → 사용자 서비스 (3003)
 *   /api/diagnoses/**      → 분석 서비스 (3004) - 이미지, 진단, 공유, 로그 통합
 *   /api/content/**       → 콘텐츠 서비스 (3005) - 피부백과 + 공지사항
 *   /api/hospitals/**     → 병원 탐색 서비스 (3006)
 *   /api/feedbacks/**     → 피드백 서비스 (3007)
 *   /api/admin/**         → 관리자 서비스 (3008) - 내부 API 통신
 *   /api/monitoring/**    → 모니터링-대시보드 서비스 (3009)
 *   /api/ai/**            → AI 진단 서버 (8001)
 */
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();
const port = process.env.PORT || 3001;
app.use(cors());

app.get("/health", (req, res) => {
  res.json({ status: "UP", service: "api-gateway", timestamp: new Date().toISOString() });
});

const services = [
  { path: "/api/auth",        target: process.env.AUTH_SERVICE_URL        || "http://localhost:3002" },
  { path: "/api/users",       target: process.env.USER_SERVICE_URL       || "http://localhost:3003" },
  { path: "/api/diagnoses",    target: process.env.DIAGNOSIS_SERVICE_URL   || "http://localhost:3004" },
  { path: "/api/content",     target: process.env.CONTENT_SERVICE_URL    || "http://localhost:3005" },
  { path: "/api/hospitals",   target: process.env.HOSPITAL_SERVICE_URL   || "http://localhost:3006" },
  { path: "/api/feedbacks",   target: process.env.FEEDBACK_SERVICE_URL   || "http://localhost:3007" },
  { path: "/api/admin",       target: process.env.ADMIN_SERVICE_URL      || "http://localhost:3008" },
  { path: "/api/monitoring",  target: process.env.MONITORING_SERVICE_URL || "http://localhost:3009" },
  { path: "/api/ai",          target: process.env.AI_SERVICE_URL         || "http://localhost:8001" },
];

services.forEach(({ path, target }) => {
  app.use(
    path,
    createProxyMiddleware({
      target,
      changeOrigin: true,
      onError: (err, req, res) => {
        console.error(`[gateway] ${path} → ${target} error:`, err.message);
        res.status(503).json({ success: false, message: `서비스에 연결할 수 없습니다: ${path}` });
      },
    })
  );
});

app.use((req, res) => {
  res.status(404).json({ success: false, message: `API Gateway: ${req.method} ${req.originalUrl} 경로를 찾을 수 없습니다.` });
});

app.listen(port, () => {
  console.log(`[api-gateway] running on port ${port}`);
  services.forEach(({ path, target }) => console.log(`  → ${path} → ${target}`));
});
