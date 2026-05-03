const { Feedback, DomainError } = require("../domain/Feedback");

/**
 * Feedback Application Service (응용 계층)
 */
class FeedbackService {
  constructor(feedbackRepository, diagnosisClient) {
    this.feedbackRepository = feedbackRepository;
    this.diagnosisClient = diagnosisClient;
  }

  // ── 피드백 작성 ───────────────────────────
  async createFeedback({ diagnosis_id, user_id, rating, content, token }) {
    // 도메인 규칙 검증 (팩토리 메서드 내부에서 수행)
    const feedback = Feedback.createNew({ diagnosis_id, user_id, rating, content });

    // 진단 기록 존재 및 소유권 확인 (서비스 간 통신)
    const diagnosis = await this.diagnosisClient.verifyDiagnosis(diagnosis_id, user_id, token);

    if (!diagnosis.exists) {
      const error = new DomainError("해당 진단 기록을 찾을 수 없습니다.");
      error.statusCode = 404;
      throw error;
    }

    if (!diagnosis.owned) {
      const error = new DomainError("본인의 진단 기록에만 피드백을 작성할 수 있습니다.");
      error.statusCode = 403;
      throw error;
    }

    // 중복 피드백 방지
    const exists = await this.feedbackRepository.existsByDiagnosisAndUser(diagnosis_id, user_id);
    if (exists) {
      const error = new DomainError("이미 해당 진단에 대한 피드백을 작성하셨습니다.");
      error.statusCode = 409;
      throw error;
    }

    const saved = await this.feedbackRepository.save(feedback);

    return {
      feedback_id: saved.feedback_id,
      diagnosis_id: saved.diagnosis_id,
      rating: saved.rating,
      content: saved.content,
    };
  }

  // ── 내 피드백 목록 조회 ───────────────────
  async getMyFeedbacks(userId, page = 1, limit = 10) {
    const feedbacks = await this.feedbackRepository.findByUserId(userId, page, limit);
    const total = await this.feedbackRepository.countByUserId(userId);

    return {
      feedbacks,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // ── 피드백 상세 조회 ──────────────────────
  async getFeedbackById(feedbackId, userId) {
    const feedback = await this.feedbackRepository.findById(feedbackId, userId);
    if (!feedback) {
      const error = new DomainError("피드백을 찾을 수 없습니다.");
      error.statusCode = 404;
      throw error;
    }
    return feedback;
  }

  // ── 진단별 피드백 조회 ────────────────────
  async getFeedbackByDiagnosis(diagnosisId, userId) {
    const feedback = await this.feedbackRepository.findByDiagnosisAndUser(diagnosisId, userId);
    if (!feedback) {
      const error = new DomainError("해당 진단에 대한 피드백이 없습니다.");
      error.statusCode = 404;
      throw error;
    }
    return feedback;
  }

  // ── 피드백 수정 ───────────────────────────
  async updateFeedback(feedbackId, userId, { rating, content }) {
    const feedback = await this.feedbackRepository.findById(feedbackId, userId);
    if (!feedback) {
      const error = new DomainError("수정할 피드백을 찾을 수 없습니다.");
      error.statusCode = 404;
      throw error;
    }

    // 도메인 엔티티에서 업데이트 수행 (검증 포함)
    feedback.updateContent({ rating, content });

    const fields = {};
    if (rating !== undefined) fields.rating = feedback.rating;
    if (content !== undefined) fields.content = feedback.content;

    if (Object.keys(fields).length === 0) {
      throw new DomainError("수정할 항목을 하나 이상 입력해주세요.");
    }

    await this.feedbackRepository.update(feedbackId, userId, fields);
    return true;
  }

  // ── 피드백 삭제 ───────────────────────────
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
