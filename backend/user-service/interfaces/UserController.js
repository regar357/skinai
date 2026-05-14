/**
 * ═══════════════════════════════════════════════
 * User Controller (인터페이스 계층)
 * ═══════════════════════════════════════════════
 */
class UserController {
  constructor(userService) {
    this.userService = userService;
  }

  // ── 내 프로필 조회 ───────────────────────
  getMyProfile = async (req, res, next) => {
    try {
      const profile = await this.userService.getMyProfile(req.user.userId);
      return res.status(200).json({
        success: true,
        id: profile.id,
        name: profile.name,
        email: profile.email,
      });
    } catch (error) {
      next(error);
    }
  };

  // ── 회원 탈퇴 (confirmText 기반) ─────────
  deleteAccount = async (req, res, next) => {
    try {
      await this.userService.deleteAccount(
        req.user.userId,
        req.body.confirmText,
      );
      return res.status(200).json({
        success: true,
        message: "회원 탈퇴가 완료되었습니다.",
      });
    } catch (error) {
      next(error);
    }
  };

  // ── [내부 API] 사용자 생성 (auth-service 호출용) ──
  createUser = async (req, res, next) => {
    try {
      const { email, name } = req.body;
      const user = await this.userService.createUser({ email, name });
      return res.status(201).json({
        success: true,
        data: { id: user.user_id, email: user.email, name: user.name },
      });
    } catch (error) {
      next(error);
    }
  };

  // ── [내부 API] 이메일로 사용자 조회 (auth-service 로그인 시) ──
  getByEmail = async (req, res, next) => {
    try {
      const user = await this.userService.getByEmail(req.params.email);
      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "사용자를 찾을 수 없습니다." });
      }
      return res.status(200).json({
        success: true,
        data: { id: user.user_id, email: user.email, name: user.name },
      });
    } catch (error) {
      next(error);
    }
  };
}

module.exports = UserController;
