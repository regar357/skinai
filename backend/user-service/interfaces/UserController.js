/**
 * ═══════════════════════════════════════════════
 * User Controller (인터페이스 계층)
 * ═══════════════════════════════════════════════
 * 
 * API: DELETE /api/users/me - 회원 탈퇴
 */
class UserController {
  constructor(userService) {
    this.userService = userService;
  }

  // ── 회원 탈퇴 ─────────────────────────────
  deleteAccount = async (req, res, next) => {
    try {
      await this.userService.deleteAccount(req.user.userId, req.body.password);
      return res.status(200).json({
        success: true,
        message: "회원 탈퇴가 완료되었습니다.",
      });
    } catch (error) {
      next(error);
    }
  };
}

module.exports = UserController;
