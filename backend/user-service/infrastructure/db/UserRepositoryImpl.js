/**
 * ═══════════════════════════════════════════════
 * User Repository MySQL 구현체 (인프라 계층)
 * ═══════════════════════════════════════════════
 */
const UserRepository = require("../../domain/interfaces/UserRepository");
const { User } = require("../../domain/entities/User");

class UserRepositoryImpl extends UserRepository {
  constructor(pool) {
    super();
    this.pool = pool;
  }

  /** ID로 조회 */
  async findById(userId) {
    const [rows] = await this.pool.execute(
      "SELECT user_id, name, email, status FROM users WHERE user_id = ? LIMIT 1",
      [userId],
    );
    if (rows.length === 0) return null;
    return new User(rows[0]);
  }

  /** 이메일로 조회 */
  async findByEmail(email) {
    const [rows] = await this.pool.execute(
      "SELECT user_id, name, email, status FROM users WHERE email = ? LIMIT 1",
      [email],
    );
    if (rows.length === 0) return null;
    return new User(rows[0]);
  }

  /** 사용자 생성 (auth-service의 회원가입 콜백) */
  async create({ email, name }) {
    // password 컬럼이 NOT NULL 이므로 placeholder 채움
    // (실제 비밀번호는 skinai_auth.auth 테이블이 보유)
    const [result] = await this.pool.execute(
      `INSERT INTO users (email, name, password, status, created_at, updated_at)
       VALUES (?, ?, '__managed_by_auth_service__', 'active', NOW(), NOW())`,
      [email, name],
    );
    return new User({
      user_id: result.insertId,
      email,
      name,
      status: "active",
    });
  }

  /** 사용자 하드 삭제 */
  async deleteById(userId) {
    const [result] = await this.pool.execute(
      "DELETE FROM users WHERE user_id = ?",
      [userId],
    );
    return result.affectedRows > 0;
  }

  /** 상태 변경 (active ↔ suspended) */
  async updateStatus(userId, status) {
    const [result] = await this.pool.execute(
      "UPDATE users SET status = ?, updated_at = NOW() WHERE user_id = ?",
      [status, userId],
    );
    return result.affectedRows > 0;
  }
}

module.exports = UserRepositoryImpl;
