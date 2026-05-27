/**
 * ═══════════════════════════════════════════════
 * User Routes (인터페이스 계층)
 * ═══════════════════════════════════════════════
 *
 * 외부 엔드포인트 (게이트웨이 통해 노출):
 *   GET    /api/v1/users/me - 내 프로필 조회 (인증 필요)
 *   DELETE /api/v1/users/me - 회원 탈퇴 (인증 필요)
 *
 * 내부 엔드포인트 (서비스 간 통신용 - 게이트웨이 노출 X):
 *   POST   /api/v1/users/internal/create     - 사용자 생성 (auth-service 호출)
 *   GET    /api/v1/users/internal/by-email/:email - 이메일로 사용자 조회
 */
const express = require("express");
const router = express.Router();

module.exports = (userController, authMiddleware) => {
  // 외부 API
  router.get("/me", authMiddleware, userController.getMyProfile);
  router.delete("/me", authMiddleware, userController.deleteAccount);

  // 내부 API (서비스 간 통신용)
  router.post("/internal/create", userController.createUser);
  router.get("/internal/by-email/:email", userController.getByEmail);
  router.post("/internal/update-last-login/:userId", userController.updateLastLogin);

  return router;
};
