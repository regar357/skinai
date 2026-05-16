/**
 * ═══════════════════════════════════════════════
 * Auth Data Model (도메인 계층 - 데이터 모델)
 * ═══════════════════════════════════════════════
 */
class AuthModel {
  constructor({ auth_id, user_id, email, password, name, role, created_at }) {
    this.auth_id = auth_id || null;
    this.user_id = user_id;
    this.email = email;
    this.password = password;
    this.name = name || null;
    this.role = role || "user";
    this.created_at = created_at || null;
  }
}

module.exports = AuthModel;
