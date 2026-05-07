/**
 * ═══════════════════════════════════════════════
 * Auth Repository Interface (도메인 계층)
 * ═══════════════════════════════════════════════
 * 
 * 역할: 인증 데이터 접근 추상화
 */
class AuthRepository {
  /** 이메일로 인증 정보 조회 (로그인, 중복 확인) */
  async findByEmail(email) { throw new Error("구현 필요"); }

  /** 새 인증 정보 저장 (회원가입) */
  async save(auth) { throw new Error("구현 필요"); }
}

module.exports = AuthRepository;
