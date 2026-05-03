/**
 * ═══════════════════════════════════════════════
 * ShareLink Entity (도메인 계층)
 * ═══════════════════════════════════════════════
 * 
 * 분석 결과 공유 링크
 */
class ShareLink {
  constructor({ share_id, diagnosis_id, user_id, share_token, expires_at, is_active, created_at }) {
    this.share_id = share_id || null;
    this.diagnosis_id = diagnosis_id;
    this.user_id = user_id;
    this.share_token = share_token;
    this.expires_at = expires_at || null;
    this.is_active = is_active !== undefined ? is_active : true;
    this.created_at = created_at || null;
  }

  isExpired() {
    if (!this.expires_at) return false;
    return new Date() > new Date(this.expires_at);
  }

  deactivate() {
    this.is_active = false;
  }
}

class DomainError extends Error {
  constructor(msg, code = 400) { super(msg); this.statusCode = code; }
}

module.exports = { ShareLink, DomainError };
