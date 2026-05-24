/**
 * ═══════════════════════════════════════════════
 * Auth Routes (인터페이스 계층)
 * ═══════════════════════════════════════════════
 *
 * 엔드포인트:
 *   POST /api/v1/auth/signup   - 회원가입 (서비스 가입신청)
 *   POST /api/v1/auth/login    - 로그인
 *   POST /api/v1/auth/logout   - 로그아웃 (인증 필요)
 */
const express = require("express");
const router = express.Router();

module.exports = (authController, authMiddleware) => {
  router.post("/signup", authController.signup);
  router.post("/login", authController.login);
  router.post("/logout", authMiddleware, authController.logout);
  return router;
};
