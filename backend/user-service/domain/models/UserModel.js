/**
 * ═══════════════════════════════════════════════
 * User Data Model (도메인 계층 - 데이터 모델)
 * ═══════════════════════════════════════════════
 *
 * 역할: User 데이터의 필드 정의 (DTO/순수 데이터)
 * - 비즈니스 규칙 없음 (검증/동작 메서드는 User 엔티티에 위치)
 */
class UserModel {
  constructor({
    user_id,
    email,
    password,
    name,
    phone,
    birth_date,
    gender,
    status,
    last_login_at,
    created_at,
    updated_at,
  }) {
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
}

module.exports = UserModel;
