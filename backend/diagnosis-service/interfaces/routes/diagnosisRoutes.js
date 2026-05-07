/**
 * ═══════════════════════════════════════════════
 * Analysis Routes (인터페이스 계층)
 * ═══════════════════════════════════════════════
 */
const express = require("express");
const router = express.Router();

module.exports = (ctrl, auth, adminAuth) => {
  // 사용자 API
  router.post("/", auth, ctrl.create);                        // 진단 생성
  router.get("/me", auth, ctrl.getMyList);                    // 내 진단 목록
  router.get("/shared/:token", ctrl.getByShareToken);         // 공유 링크로 조회 (인증 불필요)
  router.get("/logs", auth, adminAuth, ctrl.getLogs);          // 분석 로그 조회 (관리자)
  router.get("/:id", auth, ctrl.getById);                     // 진단 상세 조회
  router.put("/:id/complete", auth, ctrl.complete);           // 분석 완료 처리
  router.post("/:id/share", auth, ctrl.createShare);          // 공유 링크 생성
  router.get("/:id/logs", auth, ctrl.getLogsByDiagnosis);     // 진단별 로그

  return router;
};
