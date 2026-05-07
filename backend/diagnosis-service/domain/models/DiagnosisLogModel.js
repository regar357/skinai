/**
 * ═══════════════════════════════════════════════
 * DiagnosisLog Data Model (도메인 계층 - 데이터 모델)
 * ═══════════════════════════════════════════════
 *
 * 역할: DiagnosisLog 데이터의 필드 정의 (DTO/순수 데이터)
 * - 비즈니스 규칙 없음 (검증/동작 메서드는 DiagnosisLog 엔티티에 위치)
 */
class DiagnosisLogModel {
  constructor({ log_id, diagnosis_id, user_id, action, detail, created_at }) {
    this.log_id = log_id || null;
    this.diagnosis_id = diagnosis_id;
    this.user_id = user_id;
    this.action = action;
    this.detail = detail || null;
    this.created_at = created_at || null;
  }
}

module.exports = DiagnosisLogModel;
