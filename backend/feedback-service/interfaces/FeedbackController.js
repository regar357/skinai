/**
 * Feedback Controller (인터페이스 계층)
 */
class FeedbackController {
  constructor(feedbackService) {
    this.feedbackService = feedbackService;
  }

  createFeedback = async (req, res, next) => {
    try {
      const result = await this.feedbackService.createFeedback({
        diagnosis_id: req.body.diagnosis_id,
        user_id: req.user.userId,
        rating: req.body.rating,
        content: req.body.content,
        token: req.token,
      });
      return res.status(201).json({
        success: true,
        message: "피드백이 등록되었습니다.",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  getMyFeedbacks = async (req, res, next) => {
    try {
      const page = parseInt(req.query.page, 10) || 1;
      const limit = parseInt(req.query.limit, 10) || 10;
      const result = await this.feedbackService.getMyFeedbacks(req.user.userId, page, limit);
      return res.status(200).json({
        success: true,
        message: "피드백 목록 조회 성공",
        data: result.feedbacks,
        pagination: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  };

  getFeedbackById = async (req, res, next) => {
    try {
      const feedback = await this.feedbackService.getFeedbackById(
        req.params.feedback_id,
        req.user.userId
      );
      return res.status(200).json({
        success: true,
        message: "피드백 상세 조회 성공",
        data: feedback,
      });
    } catch (error) {
      next(error);
    }
  };

  getFeedbackByDiagnosis = async (req, res, next) => {
    try {
      const feedback = await this.feedbackService.getFeedbackByDiagnosis(
        req.params.diagnosis_id,
        req.user.userId
      );
      return res.status(200).json({
        success: true,
        message: "진단별 피드백 조회 성공",
        data: feedback,
      });
    } catch (error) {
      next(error);
    }
  };

  updateFeedback = async (req, res, next) => {
    try {
      await this.feedbackService.updateFeedback(
        req.params.feedback_id,
        req.user.userId,
        req.body
      );
      return res.status(200).json({
        success: true,
        message: "피드백이 수정되었습니다.",
      });
    } catch (error) {
      next(error);
    }
  };

  deleteFeedback = async (req, res, next) => {
    try {
      await this.feedbackService.deleteFeedback(
        req.params.feedback_id,
        req.user.userId
      );
      return res.status(200).json({
        success: true,
        message: "피드백이 삭제되었습니다.",
      });
    } catch (error) {
      next(error);
    }
  };
}

module.exports = FeedbackController;
