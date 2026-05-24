/**
 * ═══════════════════════════════════════════════
 * Content Controller (인터페이스 계층)
 * ═══════════════════════════════════════════════
 *
 * API 목록:
 *   피부백과:
 *     GET    /api/v1/content/encyclopedia          - 목록 조회
 *     GET    /api/v1/content/encyclopedia/:id      - 상세 조회
 *     POST   /api/v1/content/encyclopedia          - 등록 (관리자)
 *     PUT    /api/v1/content/encyclopedia/:id      - 수정 (관리자)
 *     DELETE /api/v1/content/encyclopedia/:id      - 삭제 (관리자)
 *
 *   공지사항:
 *     GET    /api/v1/content/notices               - 목록 조회
 *     GET    /api/v1/content/notices/:id           - 상세 조회
 *     POST   /api/v1/content/notices               - 등록 (관리자)
 *     PUT    /api/v1/content/notices/:id           - 수정 (관리자)
 *     DELETE /api/v1/content/notices/:id           - 삭제 (관리자)
 */
class ContentController {
  constructor(service) {
    this.service = service;
  }

  toMobilePagination(pagination = {}) {
    const page = Number(pagination.page || 1);
    const limit = Number(pagination.limit || 10);
    const total = Number(pagination.total || 0);
    const totalPages = Number(
      pagination.totalPages || Math.ceil(total / limit) || 1,
    );

    return {
      page,
      limit,
      total,
      totalPages,
      currentPage: page,
      totalItems: total,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    };
  }

  toMobileArticle(article) {
    return {
      ...article,
      id: article.id || article.article_id,
    };
  }

  toMobileNotice(notice) {
    const createdAt = notice.createdAt || notice.created_at || "";

    return {
      ...notice,
      id: notice.id || notice.notice_id,
      createdAt,
      date: createdAt ? new Date(createdAt).toLocaleDateString("ko-KR") : null,
      type: notice.type || (notice.is_pinned ? "update" : undefined),
    };
  }

  // ── 피부백과 ──────────────────────────────

  getArticles = async (req, res, next) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || parseInt(req.query.size) || 10;
      const result = await this.service.getArticles(
        page,
        limit,
        req.query.category,
        req.query.query,
      );
      const items = result.articles.map((article) =>
        this.toMobileArticle(article),
      );
      const pagination = this.toMobilePagination(result.pagination);

      res.status(200).json({
        success: true,
        data: items,
        items,
        total: pagination.totalItems,
        pagination,
      });
    } catch (e) {
      next(e);
    }
  };

  getArticleById = async (req, res, next) => {
    try {
      const article = await this.service.getArticleById(req.params.id);
      res.status(200).json({
        success: true,
        data: this.toMobileArticle(article),
      });
    } catch (e) {
      next(e);
    }
  };

  createArticle = async (req, res, next) => {
    try {
      const result = await this.service.createArticle(req.body);
      res.status(201).json({
        success: true,
        message: "피부백과 글이 등록되었습니다.",
        data: result,
      });
    } catch (e) {
      next(e);
    }
  };

  updateArticle = async (req, res, next) => {
    try {
      await this.service.updateArticle(req.params.id, req.body);
      res
        .status(200)
        .json({ success: true, message: "피부백과 글이 수정되었습니다." });
    } catch (e) {
      next(e);
    }
  };

  deleteArticle = async (req, res, next) => {
    try {
      await this.service.deleteArticle(req.params.id);
      res
        .status(200)
        .json({ success: true, message: "피부백과 글이 삭제되었습니다." });
    } catch (e) {
      next(e);
    }
  };

  // ── 공지사항 ──────────────────────────────

  getNotices = async (req, res, next) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || parseInt(req.query.size) || 10;
      const result = await this.service.getNotices(page, limit);
      const items = result.notices.map((notice) => this.toMobileNotice(notice));
      const pagination = this.toMobilePagination(result.pagination);

      res.status(200).json({
        success: true,
        data: items,
        items,
        total: pagination.totalItems,
        pagination,
      });
    } catch (e) {
      next(e);
    }
  };

  getNoticeById = async (req, res, next) => {
    try {
      const notice = await this.service.getNoticeById(req.params.id);
      res.status(200).json({
        success: true,
        data: this.toMobileNotice(notice),
      });
    } catch (e) {
      next(e);
    }
  };

  createNotice = async (req, res, next) => {
    try {
      const result = await this.service.createNotice({
        admin_id: req.user.userId,
        ...req.body,
      });
      res.status(201).json({
        success: true,
        message: "공지사항이 등록되었습니다.",
        data: result,
      });
    } catch (e) {
      next(e);
    }
  };

  updateNotice = async (req, res, next) => {
    try {
      await this.service.updateNotice(req.params.id, req.body);
      res
        .status(200)
        .json({ success: true, message: "공지사항이 수정되었습니다." });
    } catch (e) {
      next(e);
    }
  };

  deleteNotice = async (req, res, next) => {
    try {
      await this.service.deleteNotice(req.params.id);
      res
        .status(200)
        .json({ success: true, message: "공지사항이 삭제되었습니다." });
    } catch (e) {
      next(e);
    }
  };
}

module.exports = ContentController;
