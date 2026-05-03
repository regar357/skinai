/**
 * ═══════════════════════════════════════════════
 * User Entity (도메인 계층)
 * ═══════════════════════════════════════════════
 * 
 * 역할: 사용자 비즈니스 규칙 담당
 * 기능: 회원 탈퇴
 */
class User {
  constructor({ user_id, email, password, name, phone, birth_date, gender, status, last_login_at, created_at, updated_at }) {
    this.user_id = user_id || null;
    this.email = email;
    this.password = password;
    this.name = name;
    this.phone = phone || null;
    this.birth_date = birth_date || null;
    this.gender = gender || null;
    this.status = status || "active";
    this.last_login_at = last_login_at || null;
    this.created_at = created_at || null;
    this.updated_at = updated_at || null;
  }

  // ── 계정 활성 상태 확인 ────────────────────
  isActive() {
    return this.status === "active";
  }

  // ── 회원 탈퇴 시 상태를 inactive로 변경 ────
  deactivate() {
    this.status = "inactive";
  }
}

/** 도메인 에러 */
class DomainError extends Error {
  constructor(message, statusCode = 400) {
    super(message);
    this.name = "DomainError";
    this.statusCode = statusCode;
  }
}

module.exports = { User, DomainError };
