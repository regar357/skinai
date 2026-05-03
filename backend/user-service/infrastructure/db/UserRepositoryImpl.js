/**
 * ═══════════════════════════════════════════════
 * User Repository MySQL 구현체 (인프라 계층)
 * ═══════════════════════════════════════════════
 */
const UserRepository = require("../../domain/UserRepository");
const { User } = require("../../domain/User");

class UserRepositoryImpl extends UserRepository {
  constructor(pool) { super(); this.pool = pool; }

  /** 사용자 ID로 조회 - 탈퇴 시 비밀번호 확인용 */
  async findById(userId) {
    const [rows] = await this.pool.execute("SELECT * FROM users WHERE user_id = ? LIMIT 1", [userId]);
    if (rows.length === 0) return null;
    return new User(rows[0]);
  }

  /** 상태 변경 - 탈퇴 시 status를 'inactive'로 */
  async updateStatus(userId, status) {
    const [result] = await this.pool.execute(
      "UPDATE users SET status = ?, updated_at = NOW() WHERE user_id = ?",
      [status, userId]
    );
    return result.affectedRows > 0;
  }
}

module.exports = UserRepositoryImpl;
