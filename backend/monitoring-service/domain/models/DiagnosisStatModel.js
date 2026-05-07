/**
 * ═══════════════════════════════════════════════
 * DiagnosisStat Data Model (도메인 계층 - 데이터 모델)
 * ═══════════════════════════════════════════════
 *
 * 역할: DiagnosisStat 데이터의 필드 정의 (DTO/순수 데이터)
 * - 비즈니스 규칙 없음 (검증/동작 메서드는 DiagnosisStat 엔티티에 위치)
 */
class DiagnosisStatModel {
  constructor({ stat_id, stat_date, total_diagnoses, completed, failed, avg_confidence, created_at }) {
    this.stat_id = stat_id || null;
    this.stat_date = stat_date;
    this.total_diagnoses = total_diagnoses || 0;
    this.completed = completed || 0;
    this.failed = failed || 0;
    this.avg_confidence = avg_confidence || null;
    this.created_at = created_at || null;
  }
}

module.exports = DiagnosisStatModel;
