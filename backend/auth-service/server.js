/**
 * ═══════════════════════════════════════════════
 * Auth Service - 진입점 (Composition Root)
 * ═══════════════════════════════════════════════
 * 
 * 포트: 3002
 * 기능: 서비스 가입신청, 로그인/로그아웃
 */
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const pool = require("./infrastructure/db/pool");
const AuthRepositoryImpl = require("./infrastructure/db/AuthRepositoryImpl");
const { authenticate } = require("./infrastructure/middleware/auth");
const AuthService = require("./application/AuthService");
const AuthController = require("./interfaces/AuthController");
const createAuthRoutes = require("./interfaces/routes/authRoutes");

// 의존성 조립
const authRepository = new AuthRepositoryImpl(pool);
const authService = new AuthService(authRepository);
const authController = new AuthController(authService);

const app = express();
const port = process.env.PORT || 3002;
app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => res.json({ status: "UP", service: "auth-service" }));
app.use("/api/auth", createAuthRoutes(authController, authenticate));

app.use((err, req, res, next) => {
  console.error(`[auth-service] ${req.method} ${req.originalUrl}`, err.message);
  res.status(err.statusCode || 500).json({ success: false, message: err.statusCode ? err.message : "서버 내부 오류" });
});
app.use((req, res) => res.status(404).json({ success: false, message: "Not Found" }));

app.listen(port, () => console.log(`[auth-service] running on port ${port}`));
module.exports = app;
