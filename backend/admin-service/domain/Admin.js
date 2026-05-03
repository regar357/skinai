/**
 * ═══════════════════════════════════════════════
 * Admin Entity (도메인 계층)
 * ═══════════════════════════════════════════════
 * 
 * 관리자 서비스 - 내부 API를 통한 서비스 통신 관리
 */
class Admin {
  constructor({ admin_id, user_id, permissions, created_at }) {
    this.admin_id = admin_id || null;
    this.user_id = user_id;
    this.permissions = permissions || [];
    this.created_at = created_at || null;
  }

  hasPermission(perm) {
    return this.permissions.includes(perm) || this.permissions.includes("all");
  }
}

class DomainError extends Error {
  constructor(msg, code = 400) { super(msg); this.statusCode = code; }
}

module.exports = { Admin, DomainError };
