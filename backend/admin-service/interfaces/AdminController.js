/**
 * ═══════════════════════════════════════════════
 * Admin Controller (인터페이스 계층)
 * ═══════════════════════════════════════════════
 *
 * 다른 마이크로서비스들의 데이터를 집계/프록시하여
 * 관리자 화면을 위한 단일 인터페이스를 제공한다.
 */
class AdminController {
  constructor(adminService) {
    this.adminService = adminService;
  }

  // ── 사용자 관리 ────────────────────────────
  getUsers = async (req, res, next) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const status = req.query.status;
      const result = await this.adminService.getUsers({
        page,
        limit,
        status,
        token: req.token,
      });
      res
        .status(200)
        .json({
          success: true,
          data: result.data || [],
          pagination: result.pagination || {},
        });
    } catch (e) {
      next(e);
    }
  };

  suspendUser = async (req, res, next) => {
    try {
      const data = await this.adminService.suspendUser(
        req.params.userId,
        req.token,
      );
      res
        .status(200)
        .json({ success: true, message: "사용자가 정지되었습니다.", data });
    } catch (e) {
      next(e);
    }
  };

  unsuspendUser = async (req, res, next) => {
    try {
      const data = await this.adminService.unsuspendUser(
        req.params.userId,
        req.token,
      );
      res
        .status(200)
        .json({
          success: true,
          message: "사용자 정지가 해제되었습니다.",
          data,
        });
    } catch (e) {
      next(e);
    }
  };

  deleteUser = async (req, res, next) => {
    try {
      await this.adminService.deleteUser(req.params.userId, req.token);
      res
        .status(200)
        .json({ success: true, message: "사용자가 삭제되었습니다." });
    } catch (e) {
      next(e);
    }
  };

  // ── 피드백 관리 ────────────────────────────
  getFeedbacks = async (req, res, next) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const result = await this.adminService.getFeedbacks({
        page,
        limit,
        token: req.token,
      });
      res
        .status(200)
        .json({
          success: true,
          data: result.data || [],
          pagination: result.pagination || {},
        });
    } catch (e) {
      next(e);
    }
  };

  replyFeedback = async (req, res, next) => {
    try {
      const replyText = req.body.reply_text || req.body.replyText;
      const data = await this.adminService.replyFeedback(
        req.params.feedbackId,
        replyText,
        req.token,
      );
      res
        .status(200)
        .json({
          success: true,
          message: "피드백 답변이 등록되었습니다.",
          data,
        });
    } catch (e) {
      next(e);
    }
  };

  // ── 분석/이미지 관리 ───────────────────────
  getExamRecords = async (req, res, next) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const search = req.query.search;
      const result = await this.adminService.getExamRecords({
        page,
        limit,
        search,
        token: req.token,
      });
      res
        .status(200)
        .json({
          success: true,
          data: result.data || [],
          pagination: result.pagination || {},
        });
    } catch (e) {
      next(e);
    }
  };

  getImageInfo = async (req, res, next) => {
    try {
      const data = await this.adminService.getImageInfo(
        req.params.imageId,
        req.token,
      );
      res.status(200).json({ success: true, data });
    } catch (e) {
      next(e);
    }
  };

  // ── 질환(피부백과) 관리 ─────────────────────
  getDiseaseDetail = async (req, res, next) => {
    try {
      const data = await this.adminService.getDiseaseDetail(
        req.params.diseaseId,
      );
      res.status(200).json({ success: true, data });
    } catch (e) {
      next(e);
    }
  };

  createDisease = async (req, res, next) => {
    try {
      const data = await this.adminService.createDisease(req.body, req.token);
      res
        .status(201)
        .json({ success: true, message: "질환 정보가 등록되었습니다.", data });
    } catch (e) {
      next(e);
    }
  };

  updateDisease = async (req, res, next) => {
    try {
      const data = await this.adminService.updateDisease(
        req.params.diseaseId,
        req.body,
        req.token,
      );
      res
        .status(200)
        .json({ success: true, message: "질환 정보가 수정되었습니다.", data });
    } catch (e) {
      next(e);
    }
  };

  deleteDisease = async (req, res, next) => {
    try {
      await this.adminService.deleteDisease(req.params.diseaseId, req.token);
      res
        .status(200)
        .json({ success: true, message: "질환 정보가 삭제되었습니다." });
    } catch (e) {
      next(e);
    }
  };

  // ── 대시보드 ───────────────────────────────
  getDashboardStats = async (req, res, next) => {
    try {
      const data = await this.adminService.getDashboardStats(req.token);
      res.status(200).json({ success: true, data });
    } catch (e) {
      next(e);
    }
  };

  getDiagnosisTrend = async (req, res, next) => {
    try {
      const data = await this.adminService.getDiagnosisTrend(req.token);
      res.status(200).json({ success: true, data });
    } catch (e) {
      next(e);
    }
  };

  getDiseaseDistribution = async (req, res, next) => {
    try {
      const data = await this.adminService.getDiseaseDistribution(req.token);
      res.status(200).json({ success: true, data });
    } catch (e) {
      next(e);
    }
  };

  getUserTrend = async (req, res, next) => {
    try {
      const data = await this.adminService.getUserTrend(req.token);
      res.status(200).json({ success: true, data });
    } catch (e) {
      next(e);
    }
  };

  // ── AI 모니터링 ────────────────────────────
  getPerformanceMetrics = async (req, res, next) => {
    try {
      const data = await this.adminService.getPerformanceMetrics(req.token);
      res.status(200).json({ success: true, data });
    } catch (e) {
      next(e);
    }
  };

  getDiseaseAccuracy = async (req, res, next) => {
    try {
      const data = await this.adminService.getDiseaseAccuracy(req.token);
      res.status(200).json({ success: true, data });
    } catch (e) {
      next(e);
    }
  };

  getSystemStatus = async (req, res, next) => {
    try {
      const data = await this.adminService.getSystemStatus(req.token);
      res.status(200).json({ success: true, data });
    } catch (e) {
      next(e);
    }
  };

  getModelInfo = async (req, res, next) => {
    try {
      const data = await this.adminService.getModelInfo(req.token);
      res.status(200).json({ success: true, data });
    } catch (e) {
      next(e);
    }
  };

  // ── 공지사항 관리 ──────────────────────────
  getNotices = async (req, res, next) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const result = await this.adminService.getNotices({ page, limit });
      res
        .status(200)
        .json({
          success: true,
          data: result.data || [],
          pagination: result.pagination || {},
        });
    } catch (e) {
      next(e);
    }
  };

  createNotice = async (req, res, next) => {
    try {
      const data = await this.adminService.createNotice(req.body, req.token);
      res
        .status(201)
        .json({ success: true, message: "공지사항이 등록되었습니다.", data });
    } catch (e) {
      next(e);
    }
  };

  updateNotice = async (req, res, next) => {
    try {
      const data = await this.adminService.updateNotice(
        req.params.noticeId,
        req.body,
        req.token,
      );
      res
        .status(200)
        .json({ success: true, message: "공지사항이 수정되었습니다.", data });
    } catch (e) {
      next(e);
    }
  };

  deleteNotice = async (req, res, next) => {
    try {
      await this.adminService.deleteNotice(req.params.noticeId, req.token);
      res
        .status(200)
        .json({ success: true, message: "공지사항이 삭제되었습니다." });
    } catch (e) {
      next(e);
    }
  };
}

module.exports = AdminController;
