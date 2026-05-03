/**
 * ═══════════════════════════════════════════════
 * DiagnosisLog Entity (도메인 계층)
 * ═══════════════════════════════════════════════
 * 
 * 분석 결과 로그 데이터
 */
class DiagnosisLog {
  constructor({ log_id, diagnosis_id, user_id, action, detail, created_at }) {
    this.log_id = log_id || null;
    this.diagnosis_id = diagnosis_id;
    this.user_id = user_id;
    this.action = action;
    this.detail = detail || null;
    this.created_at = created_at || null;
  }

  static create({ diagnosis_id, user_id, action, detail }) {
    if (!diagnosis_id || !action) throw new DomainError("진단 ID와 액션은 필수입니다.");
    return new DiagnosisLog({ diagnosis_id, user_id, action, detail });
  }
}

class DomainError extends Error {
  constructor(msg, code = 400) { super(msg); this.statusCode = code; }
}

module.exports = { DiagnosisLog, DomainError };
