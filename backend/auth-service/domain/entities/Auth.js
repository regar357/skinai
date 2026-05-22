/**
 * ═══════════════════════════════════════════════
 * Auth Entity (도메인 계층 - 엔티티)
 * ═══════════════════════════════════════════════
 *
 * 역할: Auth 관련 비즈니스 규칙 담당
 * 데이터 필드 정의는 AuthModel에 위치 (이 클래스는 그것을 상속받음)
 */
const AuthModel = require("../models/AuthModel");
const DomainError = require("./DomainError");

class Auth extends AuthModel {
  // ── 비즈니스 규칙: 이메일 형식 검증 ────────
  static validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email))
      throw new DomainError("올바른 이메일 형식이 아닙니다.");
  }

  // ── 비즈니스 규칙: 비밀번호 최소 8자 ───────
  static validatePassword(password) {
    if (!password || password.length < 8)
      throw new DomainError("비밀번호는 최소 8자 이상이어야 합니다.");
  }
}

module.exports = { Auth, DomainError };
