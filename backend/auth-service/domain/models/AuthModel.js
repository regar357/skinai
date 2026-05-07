/**
 * ═══════════════════════════════════════════════
 * Auth Data Model (도메인 계층 - 데이터 모델)
 * ═══════════════════════════════════════════════
 *
 * 역할: Auth 데이터의 필드 정의 (DTO/순수 데이터)
 * - 비즈니스 규칙 없음 (검증/동작 메서드는 Auth 엔티티에 위치)
 */
class AuthModel {
  constructor({ auth_id, user_id, email, password, role, created_at }) {
    this.auth_id = auth_id || null;
    this.user_id = user_id;
    this.email = email;
    this.password = password;
    this.role = role || "user";
    this.created_at = created_at || null;
  }
}

module.exports = AuthModel;
