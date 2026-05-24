/**
 * ═══════════════════════════════════════════════
 * Admin Routes (인터페이스 계층)
 * ═══════════════════════════════════════════════
 *
 * 관리자 전용 API. 인증/관리자 권한은 API Gateway 단에서
 * 한 번 더 검증하지만, 본 라우트에서도 defense-in-depth
 * 차원에서 auth + adminAuth 미들웨어를 모두 적용한다.
 *
 * 엔드포인트 (양식 문서 기준):
 *   인증
 *     POST   /api/v1/admin/login
 *
 *   사용자 관리
 *     GET    /api/v1/admin/users
 *     PATCH  /api/v1/admin/users/:userId/suspend
 *     PATCH  /api/v1/admin/users/:userId/unsuspend
 *     DELETE /api/v1/admin/users/:userId
 *
 *   피드백 관리
 *     GET    /api/v1/admin/feedbacks
 *     POST   /api/v1/admin/feedbacks/:feedbackId/reply
 *
 *   분석/이미지 관리
 *     GET    /api/v1/admin/analyses/records
 *     GET    /api/v1/admin/analyses/images/:imageId
 *
 *   질환(피부백과) 관리
 *     GET    /api/v1/admin/diseases/:diseaseId
 *     POST   /api/v1/admin/diseases
 *     PUT    /api/v1/admin/diseases/:diseaseId
 *     DELETE /api/v1/admin/diseases/:diseaseId
 *
 *   대시보드
 *     GET    /api/v1/admin/dashboard/stats
 *     GET    /api/v1/admin/dashboard/diagnosis-trend
 *     GET    /api/v1/admin/dashboard/disease-distribution
 *     GET    /api/v1/admin/dashboard/user-trend
 *
 *   AI 모니터링
 *     GET    /api/v1/admin/monitoring/performance
 *     GET    /api/v1/admin/monitoring/disease-accuracy
 *     GET    /api/v1/admin/monitoring/system-status
 *     GET    /api/v1/admin/monitoring/model-info
 *
 *   공지사항 관리
 *     GET    /api/v1/admin/notices
 *     POST   /api/v1/admin/notices
 *     PUT    /api/v1/admin/notices/:noticeId
 *     DELETE /api/v1/admin/notices/:noticeId
 */
const express = require("express");
const router = express.Router();

module.exports = (ctrl, auth, adminAuth) => {
  // ── 사용자 관리 ────────────────────────────
  router.get("/users", auth, adminAuth, ctrl.getUsers);
  router.patch("/users/:userId/suspend", auth, adminAuth, ctrl.suspendUser);
  router.patch("/users/:userId/unsuspend", auth, adminAuth, ctrl.unsuspendUser);
  router.delete("/users/:userId", auth, adminAuth, ctrl.deleteUser);

  // ── 피드백 관리 ────────────────────────────
  router.get("/feedbacks", auth, adminAuth, ctrl.getFeedbacks);
  router.post(
    "/feedbacks/:feedbackId/reply",
    auth,
    adminAuth,
    ctrl.replyFeedback,
  );

  // ── 분석/이미지 관리 ───────────────────────
  router.get("/analyses/records", auth, adminAuth, ctrl.getExamRecords);
  router.get("/analyses/images/:imageId", auth, adminAuth, ctrl.getImageInfo);

  // ── 질환(피부백과) 관리 ─────────────────────
  router.get("/diseases/:diseaseId", auth, adminAuth, ctrl.getDiseaseDetail);
  router.post("/diseases", auth, adminAuth, ctrl.createDisease);
  router.put("/diseases/:diseaseId", auth, adminAuth, ctrl.updateDisease);
  router.delete("/diseases/:diseaseId", auth, adminAuth, ctrl.deleteDisease);

  // ── 대시보드 ───────────────────────────────
  router.get("/dashboard/stats", auth, adminAuth, ctrl.getDashboardStats);
  router.get(
    "/dashboard/diagnosis-trend",
    auth,
    adminAuth,
    ctrl.getDiagnosisTrend,
  );
  router.get(
    "/dashboard/disease-distribution",
    auth,
    adminAuth,
    ctrl.getDiseaseDistribution,
  );
  router.get("/dashboard/user-trend", auth, adminAuth, ctrl.getUserTrend);

  // ── AI 모니터링 ────────────────────────────
  router.get(
    "/monitoring/performance",
    auth,
    adminAuth,
    ctrl.getPerformanceMetrics,
  );
  router.get(
    "/monitoring/disease-accuracy",
    auth,
    adminAuth,
    ctrl.getDiseaseAccuracy,
  );
  router.get(
    "/monitoring/system-status",
    auth,
    adminAuth,
    ctrl.getSystemStatus,
  );
  router.get("/monitoring/model-info", auth, adminAuth, ctrl.getModelInfo);

  // ── 공지사항 관리 ──────────────────────────
  router.get("/notices", auth, adminAuth, ctrl.getNotices);
  router.post("/notices", auth, adminAuth, ctrl.createNotice);
  router.put("/notices/:noticeId", auth, adminAuth, ctrl.updateNotice);
  router.delete("/notices/:noticeId", auth, adminAuth, ctrl.deleteNotice);

  return router;
};
