/**
 * ═══════════════════════════════════════════════
 * User Application Service (응용 계층)
 * ═══════════════════════════════════════════════
 */
const { DomainError } = require("../domain/entities/User");

const REQUIRED_CONFIRM_TEXT = "회원탈퇴";
const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || "http://localhost:3002";
const INTERNAL_TOKEN = process.env.INTERNAL_SERVICE_TOKEN || "internal-dev-token";

class UserService {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  // ── 내 프로필 조회 ───────────────────────
  async getMyProfile(userId) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new DomainError("사용자 정보를 찾을 수 없습니다.", 404);
    }
    return {
      id: user.user_id,
      name: user.name,
      email: user.email,
    };
  }

  // ── 회원 탈퇴 (하드 삭제) ────────────────
  async deleteAccount(userId, confirmText) {
    if (!confirmText) throw new DomainError("탈퇴 확인 문구를 입력해주세요.");
    if (confirmText !== REQUIRED_CONFIRM_TEXT)
      throw new DomainError(`탈퇴 확인 문구가 올바르지 않습니다. ('${REQUIRED_CONFIRM_TEXT}'을 입력해주세요)`);

    const user = await this.userRepository.findById(userId);
    if (!user) throw new DomainError("사용자 정보를 찾을 수 없습니다.", 404);

    await this.userRepository.deleteById(userId);
    try {
      await fetch(`${AUTH_SERVICE_URL}/internal/users/${userId}`, {
        method: "DELETE",
        headers: { "x-internal-token": INTERNAL_TOKEN },
      });
    } catch { /* auth 삭제 실패 시 무시 (best-effort) */ }
    return true;
  }

  // ── [내부] 사용자 생성 (auth-service에서 호출) ──
  async createUser({ email, name }) {
    if (!email || !name) {
      throw new DomainError("이메일과 이름은 필수입니다.");
    }
    // 이미 있으면 그대로 반환 (idempotent)
    const existing = await this.userRepository.findByEmail(email);
    if (existing) return existing;

    return await this.userRepository.create({ email, name });
  }

  // ── [내부] 이메일로 사용자 조회 ──
  async getByEmail(email) {
    return await this.userRepository.findByEmail(email);
  }
}

module.exports = UserService;
