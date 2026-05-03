/**
 * ═══════════════════════════════════════════════
 * Monitoring-Dashboard Service - 진입점
 * ═══════════════════════════════════════════════
 * 
 * 포트: 3009
 * 기능:
 *   - AI 진단 모니터링 → 분석 로그 데이터 → 서비스 통신
 *   - 대시보드 → 사용자 정보 → 서비스 통신
 */
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const pool = require("./infrastructure/db/pool");
const { authenticate, requireAdmin } = require("./infrastructure/middleware/auth");
const MonitoringClient = require("./infrastructure/clients/MonitoringClient");
const MonitoringController = require("./interfaces/MonitoringController");
const createMonitoringRoutes = require("./interfaces/routes/monitoringRoutes");

// 의존성 조립
const monitoringClient = new MonitoringClient();
const monitoringController = new MonitoringController(monitoringClient, pool);

const app = express();
const port = process.env.PORT || 3009;
app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => res.json({ status: "UP", service: "monitoring-service" }));
app.use("/api/monitoring", createMonitoringRoutes(monitoringController, authenticate, requireAdmin));

app.use((err, req, res, next) => {
  console.error(`[monitoring-service] ${req.method} ${req.originalUrl}`, err.message);
  res.status(err.statusCode || 500).json({ success: false, message: err.statusCode ? err.message : "서버 내부 오류" });
});
app.use((req, res) => res.status(404).json({ success: false, message: "Not Found" }));

app.listen(port, () => console.log(`[monitoring-service] running on port ${port}`));
module.exports = app;
