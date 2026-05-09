/**
 * ═══════════════════════════════════════════════
 * Admin Service - 진입점 (Composition Root)
 * ═══════════════════════════════════════════════
 *
 * 포트: 3008
 * 기능: 관리자 화면을 위한 통합 API
 *   - 사용자/피드백/분석/이미지 관리
 *   - 질환(피부백과)/공지사항 관리 (content-service 위임)
 *   - 대시보드/AI 모니터링 통계
 *   - 관리자 로그인 (auth-service 위임 + role 검증)
 */
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const pool = require("./infrastructure/db/pool");
const { authenticate, requireAdmin } = require("./infrastructure/middleware/auth");
const ServiceClient = require("./infrastructure/clients/ServiceClient");
const AdminRepositoryImpl = require("./infrastructure/db/AdminRepositoryImpl");
const AdminService = require("./application/AdminService");
const AdminController = require("./interfaces/AdminController");
const createAdminRoutes = require("./interfaces/routes/adminRoutes");

// ── 의존성 조립 ───────────────────────────
const serviceClient = new ServiceClient();
const adminRepository = new AdminRepositoryImpl(pool);
const adminService = new AdminService({ serviceClient, adminRepository, jwt });
const adminController = new AdminController(adminService);

const app = express();
const port = process.env.PORT || 3008;
app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "UP", service: "admin-service", timestamp: new Date().toISOString() });
});

app.use("/api/v1/admin", createAdminRoutes(adminController, authenticate, requireAdmin));

app.use((err, req, res, next) => {
  console.error(`[admin-service] ${req.method} ${req.originalUrl}`, err.message);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.statusCode ? err.message : "서버 내부 오류",
  });
});
app.use((req, res) => res.status(404).json({ success: false, message: "Not Found" }));

app.listen(port, () => console.log(`[admin-service] running on port ${port}`));
module.exports = app;
