/**
 * ═══════════════════════════════════════════════
 * User Entity (도메인 계층 - 엔티티)
 * ═══════════════════════════════════════════════
 *
 * 역할: User 관련 비즈니스 규칙 담당
 * 데이터 필드 정의는 UserModel에 위치 (이 클래스는 그것을 상속받음)
 */
const UserModel = require("../models/UserModel");
const DomainError = require("./DomainError");

class User extends UserModel {
  // ── 계정 활성 상태 확인 ────────────────────
  isActive() {
    return this.status === "active";
  }

  // ── 회원 탈퇴 시 상태를 inactive로 변경 ────
  deactivate() {
    this.status = "inactive";
  }
}

module.exports = { User, DomainError };
