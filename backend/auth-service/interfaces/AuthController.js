/**
 * ═══════════════════════════════════════════════
 * Auth Controller (인터페이스 계층)
 * ═══════════════════════════════════════════════
 * 
 * API 목록:
 *   POST /api/auth/register  - 서비스 가입신청
 *   POST /api/auth/login     - 로그인
 *   POST /api/auth/logout    - 로그아웃 (인증 필요)
 */
class AuthController {
  constructor(authService) { this.authService = authService; }

  // ── 서비스 가입신청 ────────────────────────
  register = async (req, res, next) => {
    try {
      const result = await this.authService.register(req.body);
      res.status(201).json({ success: true, message: "회원가입 완료", ...result });
    } catch (e) { next(e); }
  };

  // ── 로그인 ────────────────────────────────
  login = async (req, res, next) => {
    try {
      const result = await this.authService.login(req.body);
      res.status(200).json({ success: true, message: "로그인 성공", ...result });
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
