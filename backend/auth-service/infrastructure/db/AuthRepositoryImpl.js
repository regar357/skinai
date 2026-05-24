/**
 * ═══════════════════════════════════════════════
 * Auth Repository MySQL 구현체 (인프라 계층)
 * ═══════════════════════════════════════════════
 */
const AuthRepository = require("../../domain/interfaces/AuthRepository");
const { Auth } = require("../../domain/entities/Auth");

class AuthRepositoryImpl extends AuthRepository {
  constructor(pool) {
    super();
    this.pool = pool;
  }

  /** 이메일로 인증 정보 조회 */
  async findByEmail(email) {
    const [rows] = await this.pool.execute(
      "SELECT auth_id, user_id, email, password, name, role, created_at FROM auth WHERE email = ? LIMIT 1",
      [email],
    );
    return rows.length ? new Auth(rows[0]) : null;
  }

  /** userId로 인증 정보 삭제 */
  async deleteByUserId(userId) {
    const [result] = await this.pool.execute(
      "DELETE FROM auth WHERE user_id = ?",
      [userId],
    );
    return result.affectedRows > 0;
  }

  /** 새 인증 정보 저장 */
  async save(auth) {
    const [result] = await this.pool.execute(
      "INSERT INTO auth (user_id, email, password, name, role, created_at) VALUES (?, ?, ?, ?, ?, NOW())",
      [auth.user_id, auth.email, auth.password, auth.name, auth.role],
    );
    auth.auth_id = result.insertId;
    return auth;
  }
}

module.exports = AuthRepositoryImpl;
