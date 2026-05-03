/**
 * ═══════════════════════════════════════════════
 * Auth Entity (도메인 계층)
 * ═══════════════════════════════════════════════
 * 
 * 역할: 인증 관련 비즈니스 규칙 담당
 * - 이메일 형식 검증, 비밀번호 최소 길이 검증
 * 
 * 기능: 서비스 가입신청, 로그인/로그아웃
 */
class Auth {
  constructor({ auth_id, user_id, email, password, role, created_at }) {
    this.auth_id = auth_id || null;
    this.user_id = user_id;
    this.email = email;
    this.password = password;
    this.role = role || "user";
    this.created_at = created_at || null;
  }

  // ── 비즈니스 규칙: 이메일 형식 검증 ────────
  static validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) throw new DomainError("올바른 이메일 형식이 아닙니다.");
  }

  // ── 비즈니스 규칙: 비밀번호 최소 8자 ───────
  static validatePassword(password) {
    if (!password || password.length < 8) throw new DomainError("비밀번호는 최소 8자 이상이어야 합니다.");
  }
}

/** 도메인 에러 - 비즈니스 규칙 위반 시 발생 */
class DomainError extends Error {
  constructor(message, statusCode = 400) {
    super(message);
    this.name = "DomainError";
    this.statusCode = statusCode;
  }
}

module.exports = { Auth, DomainError };
