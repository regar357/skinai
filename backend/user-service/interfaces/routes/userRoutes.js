/**
 * ═══════════════════════════════════════════════
 * User Routes (인터페이스 계층)
 * ═══════════════════════════════════════════════
 * 
 * 엔드포인트:
 *   DELETE /api/users/me - 회원 탈퇴 (인증 필요)
 */
const express = require("express");
const router = express.Router();

module.exports = (userController, authMiddleware) => {
  router.delete("/me", authMiddleware, userController.deleteAccount);
  return router;
};
