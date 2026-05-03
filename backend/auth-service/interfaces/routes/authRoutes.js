/**
 * ═══════════════════════════════════════════════
 * Auth Routes (인터페이스 계층)
 * ═══════════════════════════════════════════════
 * 
 * 엔드포인트:
 *   POST /api/auth/register  - 서비스 가입신청
 *   POST /api/auth/login     - 로그인
 *   POST /api/auth/logout    - 로그아웃 (인증 필요)
 */
const express = require("express");
const router = express.Router();

module.exports = (authController, authMiddleware) => {
  router.post("/register", authController.register);
  router.post("/login", authController.login);
  router.post("/logout", authMiddleware, authController.logout);
  return router;
};
