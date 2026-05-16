/**
 * ═══════════════════════════════════════════════
 * Diagnosis Data Model (도메인 계층 - 데이터 모델)
 * ═══════════════════════════════════════════════
 *
 * 역할: Diagnosis 데이터의 필드 정의 (DTO/순수 데이터)
 * - 비즈니스 규칙 없음 (검증/동작 메서드는 Diagnosis 엔티티에 위치)
 */
class DiagnosisModel {
  constructor({ diagnosis_id, user_id, diagnosis_type, result_summary, image_url, ai_confidence, status, created_at }) {
    this.diagnosis_id = diagnosis_id || null;
    this.user_id = user_id;
    this.diagnosis_type = diagnosis_type;
    this.result_summary = result_summary || null;
    this.image_url = image_url || null;
    this.ai_confidence = ai_confidence || null;
    this.status = status || "pending";
    this.created_at = created_at || null;
  }
}

module.exports = DiagnosisModel;
