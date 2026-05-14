/**
 * ═══════════════════════════════════════════════
 * Auth Application Service (응용 계층)
 * ═══════════════════════════════════════════════
 *
 * 기능 목록:
 *   1. 회원가입 (signup) — user-service에 사용자 생성 요청 + auth 저장
 *   2. 로그인 (JWT accessToken/refreshToken 발급)
 *   3. 로그아웃
 */
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Auth, DomainError } = require("../domain/entities/Auth");

const JWT_SECRET = process.env.JWT_SECRET || "1234";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "2h";
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || "14d";
const USER_SERVICE_URL =
  process.env.USER_SERVICE_URL || "http://localhost:3003";

class AuthService {
  constructor(authRepository) {
    this.authRepository = authRepository;
  }

  // ── 토큰 발급 헬퍼 ───────────────────────
  _issueTokens({ userId, email, name, role }) {
    const accessToken = jwt.sign({ userId, email, name, role }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });
    const refreshToken = jwt.sign(
      { userId, email, type: "refresh" },
      JWT_SECRET,
      { expiresIn: JWT_REFRESH_EXPIRES_IN },
    );
    return { accessToken, refreshToken };
  }

  // ── user-service에 사용자 생성 요청 ─────
  async _createUserInUserService({ email, name }) {
    try {
      const response = await fetch(
        `${USER_SERVICE_URL}/api/v1/users/internal/create`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, name }),
        },
      );
      const json = await response.json();
      if (!response.ok || !json.success) {
        throw new Error(json.message || "user-service create 실패");
      }
      return json.data; // { id, email, name }
    } catch (err) {
      console.error("[auth-service] user-service 호출 실패:", err.message);
      throw new DomainError("사용자 생성 중 오류가 발생했습니다.", 503);
    }
  }

  // ─────────────────────────────────────────────
  // 기능 1: 회원가입
  // POST /api/v1/auth/signup
  // ─────────────────────────────────────────────
  async signup({ email, password, name }) {
    Auth.validateEmail(email);
    Auth.validatePassword(password);
    if (!name || !name.trim()) throw new DomainError("이름을 입력해주세요.");

    // 이메일 중복 확인
    const existing = await this.authRepository.findByEmail(email);
    if (existing) throw new DomainError("이미 등록된 이메일입니다.", 409);

    // 비밀번호 해싱
    const hashedPassword = await bcrypt.hash(password, 10);

    // user-service에 사용자 생성 요청 (실제 user_id 부여)
    const userInfo = await this._createUserInUserService({ email, name });
    const userId = userInfo.id;

    // 이메일이 admin으로 시작하면 관리자
    const role = email.startsWith("admin") ? "admin" : "user";

    // 인증 정보 저장 (name도 캐시)
    const auth = new Auth({
      user_id: userId,
      email,
      password: hashedPassword,
      name,
      role,
    });
    await this.authRepository.save(auth);

    // 토큰 발급
    const { accessToken, refreshToken } = this._issueTokens({
      userId,
      email,
      name,
      role,
    });

    return {
      accessToken,
      refreshToken,
      user: { id: userId, name, email },
    };
  }

  // ─────────────────────────────────────────────
  // 기능 2: 로그인
  // POST /api/v1/auth/login
  // ─────────────────────────────────────────────
  async login({ email, password }) {
    if (!email || !password)
      throw new DomainError("이메일과 비밀번호를 입력해주세요.");

    const auth = await this.authRepository.findByEmail(email);
    if (!auth)
      throw new DomainError("이메일 또는 비밀번호가 올바르지 않습니다.", 401);

    const match = await bcrypt.compare(password, auth.password);
    if (!match)
      throw new DomainError("이메일 또는 비밀번호가 올바르지 않습니다.", 401);

    const { accessToken, refreshToken } = this._issueTokens({
      userId: auth.user_id,
      email: auth.email,
      name: auth.name || "",
      role: auth.role,
    });

    return {
      accessToken,
      refreshToken,
      user: { id: auth.user_id, name: auth.name || "", email: auth.email },
    };
  }

  // ─────────────────────────────────────────────
  // 기능 3: 로그아웃
  // ─────────────────────────────────────────────
  async logout() {
    return true;
  }
}

module.exports = AuthService;
