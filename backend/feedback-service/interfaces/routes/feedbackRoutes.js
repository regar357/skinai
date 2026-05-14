/**
 * ═══════════════════════════════════════════════
 * Feedback Routes (인터페이스 계층)
 * ═══════════════════════════════════════════════
 *
 * 사용자 API:
 *   POST   /api/v1/feedback                       - 피드백 작성
 *   GET    /api/v1/feedback/my                    - 내 피드백 목록
 *   DELETE /api/v1/feedback/my/:id                - 내 피드백 삭제
 *   GET    /api/v1/feedback/diagnosis/:diagnosis_id - 진단별 피드백
 *   GET    /api/v1/feedback/:feedback_id          - 피드백 상세
 *   PUT    /api/v1/feedback/:feedback_id          - 피드백 수정
 */
const express = require("express");
const router = express.Router();

module.exports = (feedbackController, authMiddleware) => {
  // 사용자 자신의 피드백 (구 /me → /my)
  router.post("/", authMiddleware, feedbackController.createFeedback);
  router.get("/my", authMiddleware, feedbackController.getMyFeedbacks);
  router.delete("/my/:id", authMiddleware, feedbackController.deleteMyFeedback);

  // 진단별 / 피드백 상세 / 수정
  router.get(
    "/diagnosis/:diagnosis_id",
    authMiddleware,
    feedbackController.getFeedbackByDiagnosis,
  );
  router.get(
    "/:feedback_id",
    authMiddleware,
    feedbackController.getFeedbackById,
  );
  router.put(
    "/:feedback_id",
    authMiddleware,
    feedbackController.updateFeedback,
  );

  return router;
};
