/**
 * ═══════════════════════════════════════════════
 * Diagnosis Entity (도메인 계층)
 * ═══════════════════════════════════════════════
 * 
 * 분석 서비스 - 진단 관련 비즈니스 규칙
 */
class Diagnosis {
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

class DomainError extends Error {
  constructor(message, statusCode = 400) {
    super(message);
    this.name = "DomainError";
    this.statusCode = statusCode;
  }
}

module.exports = { Diagnosis, DomainError };
