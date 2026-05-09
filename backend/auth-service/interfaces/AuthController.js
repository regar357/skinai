/**
 * ═══════════════════════════════════════════════
 * Auth Controller (인터페이스 계층)
 * ═══════════════════════════════════════════════
 *
 * API 목록:
 *   POST /api/v1/auth/signup   - 회원가입 (서비스 가입신청)
 *   POST /api/v1/auth/login    - 로그인
 *   POST /api/v1/auth/logout   - 로그아웃 (인증 필요)
 *
 * 응답 표준 (프론트엔드 양식 정합):
 *   - signup / login → { accessToken, refreshToken, user: { id, name, email } }
 */
class AuthController {
  constructor(authService) { this.authService = authService; }

  // ── 회원가입 (signup) ────────────────────────
  signup = async (req, res, next) => {
    try {
      const result = await this.authService.signup(req.body);
      res.status(201).json({
        success: true,
        message: "회원가입 완료",
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
        user: result.user,
      });
    } catch (e) { next(e); }
  };

  // ── 로그인 ────────────────────────────────
  login = async (req, res, next) => {
    try {
      const result = await this.authService.login(req.body);
      res.status(200).json({
        success: true,
        message: "로그인 성공",
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
        user: result.user,
      });
    } catch (e) { next(e); }
  };

  // ── 로그아웃 ──────────────────────────────
  logout = async (req, res, next) => {
    try {
      await this.authService.logout();
      res.status(200).json({ success: true, message: "로그아웃 되었습니다." });
    } catch (e) { next(e); }
  };
}

module.exports = AuthController;
