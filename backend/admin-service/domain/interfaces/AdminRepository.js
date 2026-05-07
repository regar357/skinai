/**
 * ═══════════════════════════════════════════════
 * Admin Repository Interface (도메인 계층)
 * ═══════════════════════════════════════════════
 */
class AdminRepository {
  async findById(adminId) { throw new Error("구현 필요"); }
  async findByUserId(userId) { throw new Error("구현 필요"); }
  async save(admin) { throw new Error("구현 필요"); }
}

module.exports = AdminRepository;
