/**
 * ═══════════════════════════════════════════════
 * User Service - 진입점 (Composition Root)
 * ═══════════════════════════════════════════════
 *
 * 포트: 3003
 * 기능: 회원 탈퇴
 */
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const pool = require("./infrastructure/db/pool");
const UserRepositoryImpl = require("./infrastructure/db/UserRepositoryImpl");
const { authenticate } = require("./infrastructure/middleware/auth");
const UserService = require("./application/UserService");
const InternalMonitoringService = require("./application/InternalMonitoringService");
const InternalAdminService = require("./application/InternalAdminService");
const UserController = require("./interfaces/UserController");
const InternalMonitoringController = require("./interfaces/InternalMonitoringController");
const InternalAdminController = require("./interfaces/InternalAdminController");
const createUserRoutes = require("./interfaces/routes/userRoutes");
const createInternalMonitoringRoutes = require("./interfaces/routes/internalMonitoringRoutes");
const createInternalAdminRoutes = require("./interfaces/routes/internalAdminRoutes");

// 의존성 조립
const userRepository = new UserRepositoryImpl(pool);
const userService = new UserService(userRepository);
const userController = new UserController(userService);
const internalMonitoringService = new InternalMonitoringService(pool);
const internalMonitoringController = new InternalMonitoringController(internalMonitoringService);
const internalAdminService = new InternalAdminService(pool);
const internalAdminController = new InternalAdminController(internalAdminService);

const app = express();
const port = process.env.PORT || 3003;
app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({
    status: "UP",
    service: "user-service",
    timestamp: new Date().toISOString(),
  });
});
app.use("/api/v1/users", createUserRoutes(userController, authenticate));
app.use("/internal/monitoring", createInternalMonitoringRoutes(internalMonitoringController));
app.use("/internal/admin", createInternalAdminRoutes(internalAdminController));

app.use((err, req, res, next) => {
  console.error(`[user-service] ${req.method} ${req.originalUrl}`, err.message);
  const statusCode = err.statusCode || 500;
  res
    .status(statusCode)
    .json({
      success: false,
      message: err.statusCode ? err.message : "서버 내부 오류",
    });
});
app.use((req, res) =>
  res.status(404).json({ success: false, message: "Not Found" }),
);

app.listen(port, () => console.log(`[user-service] running on port ${port}`));
module.exports = app;
