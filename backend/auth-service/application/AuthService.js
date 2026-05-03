/**
 * ═══════════════════════════════════════════════
 * Auth Application Service (응용 계층)
 * ═══════════════════════════════════════════════
 * 
 * 기능 목록:
 *   1. 서비스 가입신청
 *   2. 로그인 (JWT 발급)
 *   3. 로그아웃
 */
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Auth, DomainError } = require("../domain/Auth");

const JWT_SECRET = process.env.JWT_SECRET || "1234";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "2h";

class AuthService {
  constructor(authRepository) { this.authRepository = authRepository; }

  // ─────────────────────────────────────────────
  // 기능 1: 서비스 가입신청
  // POST /api/auth/register
  // ─────────────────────────────────────────────
  async register({ email, password, name }) {
    // 도메인 규칙 검증
    Auth.validateEmail(email);
    Auth.validatePassword(password);

    // 이메일 중복 확인
    const existing = await this.authRepository.findByEmail(email);
    if (existing) throw new DomainError("이미 등록된 이메일입니다.", 409);

    // 비밀번호 해싱
    const hashedPassword = await bcrypt.hash(password, 10);

    // TODO: User Service에 사용자 생성 요청 (서비스 간 통신)
    const userId = Date.now(); // 임시 - User Service 연동 시 교체

    // 이메일이 admin으로 시작하면 관리자로 등록
    const role = email.startsWith("admin") ? "admin" : "user";

    // 인증 정보 저장
    const auth = new Auth({ user_id: userId, email, password: hashedPassword, role });
    await this.authRepository.save(auth);

    // JWT 토큰 발급
    const token = jwt.sign(
      { userId, email, name, role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    return { token, data: { user_id: userId, email, name, role } };
  }

  // ─────────────────────────────────────────────
  // 기능 2: 로그인 (JWT 발급)
  // POST /api/auth/login
  // ─────────────────────────────────────────────
  async login({ email, password }) {
    if (!email || !password) throw new DomainError("이메일과 비밀번호를 입력해주세요.");

    // 이메일로 인증 정보 조회
    const auth = await this.authRepository.findByEmail(email);
    if (!auth) throw new DomainError("이메일 또는 비밀번호가 올바르지 않습니다.", 401);

    // 비밀번호 일치 확인
    const match = await bcrypt.compare(password, auth.password);
    if (!match) throw new DomainError("이메일 또는 비밀번호가 올바르지 않습니다.", 401);

    // JWT 토큰 발급
    const token = jwt.sign(
      { userId: auth.user_id, email: auth.email, role: auth.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    return { token, data: { user_id: auth.user_id, email: auth.email } };
  }

  // ─────────────────────────────────────────────
  // 기능 3: 로그아웃
  // POST /api/auth/logout
  // - 클라이언트 측에서 토큰 삭제로 처리
  // ─────────────────────────────────────────────
  async logout() {
    return true;
  }
}

module.exports = AuthService;
