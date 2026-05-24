const express = require("express");
const router = express.Router();

module.exports = (feedbackController, authMiddleware) => {
  router.post("/", authMiddleware, feedbackController.createFeedback);
  router.get("/my", authMiddleware, feedbackController.getMyFeedbacks);
  router.delete("/my/:id", authMiddleware, feedbackController.deleteMyFeedback);
  router.get("/:feedback_id", authMiddleware, feedbackController.getFeedbackById);
  router.put("/:feedback_id", authMiddleware, feedbackController.updateFeedback);
  return router;
};
