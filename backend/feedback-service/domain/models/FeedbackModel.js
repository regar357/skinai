/**
 * ═══════════════════════════════════════════════
 * Feedback Data Model (도메인 계층 - 데이터 모델)
 * ═══════════════════════════════════════════════
 *
 * 역할: Feedback 데이터의 필드 정의 (DTO/순수 데이터)
 * - 비즈니스 규칙 없음 (검증/동작 메서드는 Feedback 엔티티에 위치)
 */
class FeedbackModel {
  constructor({ feedback_id, diagnosis_id, user_id, rating, content, created_at, updated_at }) {
    this.feedback_id = feedback_id || null;
    this.diagnosis_id = diagnosis_id;
    this.user_id = user_id;
    this.rating = rating;
    this.content = content || null;
    this.created_at = created_at || null;
    this.updated_at = updated_at || null;
  }
}

module.exports = FeedbackModel;
