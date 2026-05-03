/**
 * Feedback Entity (도메인 계층)
 */
class Feedback {
  constructor({ feedback_id, diagnosis_id, user_id, rating, content, created_at, updated_at }) {
    this.feedback_id = feedback_id || null;
    this.diagnosis_id = diagnosis_id;
    this.user_id = user_id;
    this.rating = rating;
    this.content = content || null;
    this.created_at = created_at || null;
    this.updated_at = updated_at || null;
  }

  // ── 비즈니스 규칙 ────────────────────────

  static validateRating(rating) {
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      throw new DomainError("평점은 1~5 사이의 정수여야 합니다.");
    }
  }

  static validateRequired({ diagnosis_id, rating }) {
    if (!diagnosis_id || rating === undefined || rating === null) {
      throw new DomainError("진단 ID와 평점은 필수 입력 항목입니다.");
    }
  }

  /**
   * 피드백 생성 팩토리 메서드
   */
  static createNew({ diagnosis_id, user_id, rating, content }) {
    Feedback.validateRequired({ diagnosis_id, rating });
    Feedback.validateRating(rating);

    return new Feedback({ diagnosis_id, user_id, rating, content });
  }

  updateContent({ rating, content }) {
    if (rating !== undefined) {
      Feedback.validateRating(rating);
      this.rating = rating;
    }
    if (content !== undefined) {
      this.content = content;
    }
  }
}

class DomainError extends Error {
  constructor(message) {
    super(message);
    this.name = "DomainError";
    this.statusCode = 400;
  }
}

module.exports = { Feedback, DomainError };
