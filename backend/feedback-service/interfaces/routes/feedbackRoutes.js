const express = require("express");
const router = express.Router();

module.exports = (feedbackController, authMiddleware) => {
  router.post("/", authMiddleware, feedbackController.createFeedback);
  router.get("/me", authMiddleware, feedbackController.getMyFeedbacks);
  router.get("/diagnosis/:diagnosis_id", authMiddleware, feedbackController.getFeedbackByDiagnosis);
  router.get("/:feedback_id", authMiddleware, feedbackController.getFeedbackById);
  router.put("/:feedback_id", authMiddleware, feedbackController.updateFeedback);
  router.delete("/:feedback_id", authMiddleware, feedbackController.deleteFeedback);

  return router;
};
