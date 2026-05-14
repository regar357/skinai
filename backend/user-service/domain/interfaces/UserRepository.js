/**
 * ═══════════════════════════════════════════════
 * User Repository Interface (도메인 계층)
 * ═══════════════════════════════════════════════
 */
class UserRepository {
  async findById(userId) {
    throw new Error("구현 필요");
  }
  async findByEmail(email) {
    throw new Error("구현 필요");
  }
  async create({ email, name }) {
    throw new Error("구현 필요");
  }
  async updateStatus(userId, status) {
    throw new Error("구현 필요");
  }
}

module.exports = UserRepository;
