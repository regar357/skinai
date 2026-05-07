/**
 * ═══════════════════════════════════════════════
 * DiagnosisLog Entity (도메인 계층 - 엔티티)
 * ═══════════════════════════════════════════════
 *
 * 역할: DiagnosisLog 관련 비즈니스 규칙 담당
 * 데이터 필드 정의는 DiagnosisLogModel에 위치 (이 클래스는 그것을 상속받음)
 */
const DiagnosisLogModel = require("../models/DiagnosisLogModel");
const DomainError = require("./DomainError");

class DiagnosisLog extends DiagnosisLogModel {
  static create({ diagnosis_id, user_id, action, detail }) {
    if (!diagnosis_id || !action) throw new DomainError("진단 ID와 액션은 필수입니다.");
    return new DiagnosisLog({ diagnosis_id, user_id, action, detail });
  }
}

module.exports = { DiagnosisLog, DomainError };
