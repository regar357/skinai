/**
 * ═══════════════════════════════════════════════
 * Feedback Entity (도메인 계층 - 엔티티)
 * ═══════════════════════════════════════════════
 *
 * 역할: Feedback 관련 비즈니스 규칙 담당
 * 데이터 필드 정의는 FeedbackModel에 위치 (이 클래스는 그것을 상속받음)
 */
const FeedbackModel = require("../models/FeedbackModel");
const DomainError = require("./DomainError");

class Feedback extends FeedbackModel {
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

module.exports = { Feedback, DomainError };
