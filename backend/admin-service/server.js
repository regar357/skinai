/**
 * ═══════════════════════════════════════════════
 * Admin Service - 진입점 (Composition Root)
 * ═══════════════════════════════════════════════
 * 
 * 포트: 3008
 * 기능: 서비스 통신 (내부 API)
 */
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { authenticate, requireAdmin } = require("./infrastructure/middleware/auth");
const ServiceClient = require("./infrastructure/clients/ServiceClient");
const AdminController = require("./interfaces/AdminController");
const createAdminRoutes = require("./interfaces/routes/adminRoutes");

// 의존성 조립
const serviceClient = new ServiceClient();
const adminController = new AdminController(serviceClient);

const app = express();
const port = process.env.PORT || 3008;
app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => res.json({ status: "UP", service: "admin-service" }));
app.use("/api/admin", createAdminRoutes(adminController, authenticate, requireAdmin));

app.use((err, req, res, next) => {
  console.error(`[admin-service] ${req.method} ${req.originalUrl}`, err.message);
  res.status(err.statusCode || 500).json({ success: false, message: err.statusCode ? err.message : "서버 내부 오류" });
});
app.use((req, res) => res.status(404).json({ success: false, message: "Not Found" }));

app.listen(port, () => console.log(`[admin-service] running on port ${port}`));
module.exports = app;
