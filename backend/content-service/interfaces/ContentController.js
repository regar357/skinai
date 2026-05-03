/**
 * ═══════════════════════════════════════════════
 * Content Controller (인터페이스 계층)
 * ═══════════════════════════════════════════════
 * 
 * API 목록:
 *   피부백과:
 *     GET    /api/content/encyclopedia          - 목록 조회
 *     GET    /api/content/encyclopedia/:id      - 상세 조회
 *     POST   /api/content/encyclopedia          - 등록 (관리자)
 *     PUT    /api/content/encyclopedia/:id      - 수정 (관리자)
 *     DELETE /api/content/encyclopedia/:id      - 삭제 (관리자)
 *
 *   공지사항:
 *     GET    /api/content/notices               - 목록 조회
 *     GET    /api/content/notices/:id           - 상세 조회
 *     POST   /api/content/notices               - 등록 (관리자)
 *     PUT    /api/content/notices/:id           - 수정 (관리자)
 *     DELETE /api/content/notices/:id           - 삭제 (관리자)
 */
class ContentController {
  constructor(service) { this.service = service; }

  // ── 피부백과 ──────────────────────────────

  getArticles = async (req, res, next) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const result = await this.service.getArticles(page, limit, req.query.category);
      res.status(200).json({ success: true, data: result.articles, pagination: result.pagination });
    } catch (e) { next(e); }
  };

  getArticleById = async (req, res, next) => {
    try {
      const article = await this.service.getArticleById(req.params.id);
      res.status(200).json({ success: true, data: article });
    } catch (e) { next(e); }
  };

  createArticle = async (req, res, next) => {
    try {
      const result = await this.service.createArticle(req.body);
      res.status(201).json({ success: true, message: "피부백과 글이 등록되었습니다.", data: result });
    } catch (e) { next(e); }
  };

  updateArticle = async (req, res, next) => {
    try {
      await this.service.updateArticle(req.params.id, req.body);
      res.status(200).json({ success: true, message: "피부백과 글이 수정되었습니다." });
    } catch (e) { next(e); }
  };

  deleteArticle = async (req, res, next) => {
    try {
      await this.service.deleteArticle(req.params.id);
      res.status(200).json({ success: true, message: "피부백과 글이 삭제되었습니다." });
    } catch (e) { next(e); }
  };

  // ── 공지사항 ──────────────────────────────

  getNotices = async (req, res, next) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const result = await this.service.getNotices(page, limit);
      res.status(200).json({ success: true, data: result.notices, pagination: result.pagination });
    } catch (e) { next(e); }
  };

  getNoticeById = async (req, res, next) => {
    try {
      const notice = await this.service.getNoticeById(req.params.id);
      res.status(200).json({ success: true, data: notice });
    } catch (e) { next(e); }
  };

  createNotice = async (req, res, next) => {
    try {
      const result = await this.service.createNotice({ admin_id: req.user.userId, ...req.body });
      res.status(201).json({ success: true, message: "공지사항이 등록되었습니다.", data: result });
    } catch (e) { next(e); }
  };

  updateNotice = async (req, res, next) => {
    try {
      await this.service.updateNotice(req.params.id, req.body);
      res.status(200).json({ success: true, message: "공지사항이 수정되었습니다." });
    } catch (e) { next(e); }
  };

  deleteNotice = async (req, res, next) => {
    try {
      await this.service.deleteNotice(req.params.id);
      res.status(200).json({ success: true, message: "공지사항이 삭제되었습니다." });
    } catch (e) { next(e); }
  };
}

module.exports = ContentController;
