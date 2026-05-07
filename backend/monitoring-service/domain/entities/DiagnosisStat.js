/**
 * ═══════════════════════════════════════════════
 * DiagnosisStat Entity (도메인 계층 - 엔티티)
 * ═══════════════════════════════════════════════
 *
 * 역할: DiagnosisStat 관련 비즈니스 규칙 담당
 * 데이터 필드 정의는 DiagnosisStatModel에 위치 (이 클래스는 그것을 상속받음)
 */
const DiagnosisStatModel = require("../models/DiagnosisStatModel");
const DomainError = require("./DomainError");

class DiagnosisStat extends DiagnosisStatModel {
  // (비즈니스 메서드 없음 - 데이터 모델만 사용)
}

module.exports = { DiagnosisStat, DomainError };
