/**
 * ═══════════════════════════════════════════════
 * User Application Service (응용 계층)
 * ═══════════════════════════════════════════════
 * 
 * 기능: 회원 탈퇴 (소프트 삭제)
 */
const bcrypt = require("bcryptjs");
const { User, DomainError } = require("../domain/User");

class UserService {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  // ─────────────────────────────────────────────
  // 회원 탈퇴 (소프트 삭제)
  // DELETE /api/users/me
  // - 실제 데이터 삭제가 아닌 status를 'inactive'로 변경
  // ─────────────────────────────────────────────
  async deleteAccount(userId, password) {
    // 비밀번호 필수 입력 확인
    if (!password) {
      throw new DomainError("탈퇴를 위해 비밀번호를 입력해주세요.");
    }

    // 현재 사용자 조회
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new DomainError("사용자 정보를 찾을 수 없습니다.", 404);
    }

    // 비밀번호 일치 여부 확인
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new DomainError("비밀번호가 올바르지 않습니다.", 401);
    }

    // 도메인 엔티티에서 상태 변경 → DB에 반영
    user.deactivate();
    await this.userRepository.updateStatus(userId, user.status);
    return true;
  }
}

module.exports = UserService;
