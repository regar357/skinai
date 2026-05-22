class FeedbackController {
  constructor(feedbackService) {
    this.feedbackService = feedbackService;
  }

  createFeedback = async (req, res, next) => {
    try {
      const result = await this.feedbackService.createFeedback({
        user_id: req.user.userId,
        rating: req.body.rating,
        content: req.body.content || null,
      });
      return res.status(201).json({ success: true, message: "피드백이 등록되었습니다.", data: result });
    } catch (error) { next(error); }
  };

  getMyFeedbacks = async (req, res, next) => {
    try {
      const page = parseInt(req.query.page, 10) || 1;
      const limit = parseInt(req.query.limit, 10) || 10;
      const result = await this.feedbackService.getMyFeedbacks(req.user.userId, page, limit);
      return res.status(200).json({ success: true, data: result.feedbacks, pagination: result.pagination });
    } catch (error) { next(error); }
  };

  getFeedbackById = async (req, res, next) => {
    try {
      const feedback = await this.feedbackService.getFeedbackById(req.params.feedback_id, req.user.userId);
      return res.status(200).json({ success: true, data: feedback });
    } catch (error) { next(error); }
  };

  updateFeedback = async (req, res, next) => {
    try {
      await this.feedbackService.updateFeedback(req.params.feedback_id, req.user.userId, req.body);
      return res.status(200).json({ success: true, message: "피드백이 수정되었습니다." });
    } catch (error) { next(error); }
  };

  deleteMyFeedback = async (req, res, next) => {
    try {
      await this.feedbackService.deleteFeedback(req.params.id, req.user.userId);
      return res.status(200).json({ success: true, message: "피드백이 삭제되었습니다." });
    } catch (error) { next(error); }
  };
}

module.exports = FeedbackController;
