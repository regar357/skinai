/**
 * ═══════════════════════════════════════════════
 * Diagnosis Routes (인터페이스 계층)
 * ═══════════════════════════════════════════════
 *
 * 사용자 API:
 *   POST   /api/v1/diagnoses              - 진단 생성 (이미지 분석 요청)
 *   GET    /api/v1/diagnoses/history      - 내 진단 이력
 *   GET    /api/v1/diagnoses/shared/:token - 공유 링크로 결과 조회 (인증 불필요)
 *   GET    /api/v1/diagnoses/:id          - 진단 상세 조회
 *   DELETE /api/v1/diagnoses/:id          - 진단 단건 삭제
 *   DELETE /api/v1/diagnoses              - 진단 다건 삭제 ({ ids: [] })
 *   PUT    /api/v1/diagnoses/:id/complete - 분석 완료 처리 (AI 콜백)
 *   POST   /api/v1/diagnoses/:id/share    - 공유 링크 생성
 *
 * 관리자 API:
 *   GET    /api/v1/diagnoses/logs         - 분석 로그 조회
 *   GET    /api/v1/diagnoses/:id/logs     - 진단별 로그 조회
 */
const express = require("express");
const router = express.Router();

module.exports = (ctrl, auth, adminAuth) => {
  // 사용자 API
  router.post("/", auth, ctrl.create); // 진단 생성
  router.get("/history", auth, ctrl.getMyList); // 내 진단 이력 (구 /me)
  router.delete("/", auth, ctrl.deleteMany); // 다건 삭제
  router.get("/shared/:token", ctrl.getByShareToken); // 공유 링크 (비로그인)
  router.get("/logs", auth, adminAuth, ctrl.getLogs); // 분석 로그 (관리자)
  router.get("/:id", auth, ctrl.getById); // 진단 상세
  router.delete("/:id", auth, ctrl.deleteOne); // 단건 삭제
  router.put("/:id/complete", auth, ctrl.complete); // 분석 완료
  router.post("/:id/share", auth, ctrl.createShare); // 공유 링크 생성
  router.get("/:id/logs", auth, adminAuth, ctrl.getLogsByDiagnosis); // 진단별 로그

  return router;
};
