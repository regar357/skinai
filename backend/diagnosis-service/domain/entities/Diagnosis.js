/**
 * ═══════════════════════════════════════════════
 * Diagnosis Entity (도메인 계층 - 엔티티)
 * ═══════════════════════════════════════════════
 *
 * 역할: Diagnosis 관련 비즈니스 규칙 담당
 * 데이터 필드 정의는 DiagnosisModel에 위치 (이 클래스는 그것을 상속받음)
 */
const DiagnosisModel = require("../models/DiagnosisModel");
const DomainError = require("./DomainError");

class Diagnosis extends DiagnosisModel {
  static validateType(type) {
    if (!["skin", "face"].includes(type)) throw new DomainError("진단 타입은 skin 또는 face여야 합니다.");
  }

  static createNew({ user_id, diagnosis_type, image_url }) {
    if (!user_id || !diagnosis_type) throw new DomainError("사용자 ID와 진단 타입은 필수입니다.");
    Diagnosis.validateType(diagnosis_type);
    return new Diagnosis({ user_id, diagnosis_type, image_url });
  }

  complete(result_summary, ai_confidence) {
    this.status = "completed";
    this.result_summary = result_summary;
    this.ai_confidence = ai_confidence;
  }
}

module.exports = { Diagnosis, DomainError };
