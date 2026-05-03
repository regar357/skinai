/**
 * ═══════════════════════════════════════════════
 * Auth Repository MySQL 구현체 (인프라 계층)
 * ═══════════════════════════════════════════════
 * 
 * 역할: AuthRepository 인터페이스를 MySQL 쿼리로 구현
 */
const AuthRepository = require("../../domain/AuthRepository");
const { Auth } = require("../../domain/Auth");

class AuthRepositoryImpl extends AuthRepository {
  constructor(pool) { super(); this.pool = pool; }

  /** 이메일로 인증 정보 조회 */
  async findByEmail(email) {
    const [rows] = await this.pool.execute("SELECT * FROM auth WHERE email = ? LIMIT 1", [email]);
    return rows.length ? new Auth(rows[0]) : null;
  }

  /** 새 인증 정보 저장 */
  async save(auth) {
    const [result] = await this.pool.execute(
      "INSERT INTO auth (user_id, email, password, role, created_at) VALUES (?, ?, ?, ?, NOW())",
      [auth.user_id, auth.email, auth.password, auth.role]
    );
    auth.auth_id = result.insertId;
    return auth;
  }
}

module.exports = AuthRepositoryImpl;
