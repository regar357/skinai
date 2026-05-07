/**
 * ═══════════════════════════════════════════════
 * User Repository Interface (도메인 계층)
 * ═══════════════════════════════════════════════
 */
class UserRepository {
  /** 사용자 ID로 조회 (탈퇴 시 사용) */
  async findById(userId) { throw new Error("구현 필요"); }

  /** 상태 변경 (회원 탈퇴 시 inactive로) */
  async updateStatus(userId, status) { throw new Error("구현 필요"); }
}

module.exports = UserRepository;
