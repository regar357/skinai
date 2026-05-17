const { Feedback, DomainError } = require("../domain/entities/Feedback");

class FeedbackService {
  constructor(feedbackRepository) {
    this.feedbackRepository = feedbackRepository;
  }

  async createFeedback({ user_id, rating, content }) {
    const feedback = Feedback.createNew({ user_id, rating, content });
    const saved = await this.feedbackRepository.save(feedback);
    return { feedback_id: saved.feedback_id, rating: saved.rating, content: saved.content };
  }

  async getMyFeedbacks(userId, page = 1, limit = 10) {
    const feedbacks = await this.feedbackRepository.findByUserId(userId, page, limit);
    const total = await this.feedbackRepository.countByUserId(userId);
    return { feedbacks, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async getFeedbackById(feedbackId, userId) {
    const feedback = await this.feedbackRepository.findById(feedbackId, userId);
    if (!feedback) {
      const error = new DomainError("피드백을 찾을 수 없습니다.");
      error.statusCode = 404;
      throw error;
    }
    return feedback;
  }

  async updateFeedback(feedbackId, userId, { rating, content }) {
    const feedback = await this.feedbackRepository.findById(feedbackId, userId);
    if (!feedback) {
      const error = new DomainError("수정할 피드백을 찾을 수 없습니다.");
      error.statusCode = 404;
      throw error;
    }
    feedback.updateContent({ rating, content });
    const fields = {};
    if (rating !== undefined) fields.rating = feedback.rating;
    if (content !== undefined) fields.content = feedback.content;
    if (!Object.keys(fields).length) throw new DomainError("수정할 항목을 하나 이상 입력해주세요.");
    await this.feedbackRepository.update(feedbackId, userId, fields);
    return true;
  }

  async deleteFeedback(feedbackId, userId) {
    const deleted = await this.feedbackRepository.delete(feedbackId, userId);
    if (!deleted) {
      const error = new DomainError("삭제할 피드백을 찾을 수 없습니다.");
      error.statusCode = 404;
      throw error;
    }
    return true;
  }
}

module.exports = FeedbackService;
