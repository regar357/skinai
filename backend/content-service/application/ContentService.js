/**
 * ═══════════════════════════════════════════════
 * Content Application Service (응용 계층)
 * ═══════════════════════════════════════════════
 * 
 * 통합 기능:
 *   - 피부백과 CRUD
 *   - 공지사항 CRUD
 */
const { Encyclopedia, DomainError: EncError } = require("../domain/Encyclopedia");
const { Notice, DomainError: NoticeError } = require("../domain/Notice");

class ContentService {
  constructor(contentRepository) { this.contentRepository = contentRepository; }

  // ── 피부백과 ──────────────────────────────

  async getArticles(page = 1, limit = 10, category) {
    const articles = await this.contentRepository.findArticles(page, limit, category);
    const total = await this.contentRepository.countArticles(category);
    return { articles, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async getArticleById(id) {
    const article = await this.contentRepository.findArticleById(id);
    if (!article) throw new EncError("피부백과 글을 찾을 수 없습니다.", 404);
    await this.contentRepository.incrementViewCount(id);
    return article;
  }

  async createArticle({ title, content, category, image_url }) {
    Encyclopedia.validateRequired({ title, content });
    const article = new Encyclopedia({ title, content, category, image_url });
    return await this.contentRepository.saveArticle(article);
  }

  async updateArticle(id, fields) {
    const article = await this.contentRepository.findArticleById(id);
    if (!article) throw new EncError("피부백과 글을 찾을 수 없습니다.", 404);
    return await this.contentRepository.updateArticle(id, fields);
  }

  async deleteArticle(id) {
    const deleted = await this.contentRepository.deleteArticle(id);
    if (!deleted) throw new EncError("피부백과 글을 찾을 수 없습니다.", 404);
    return true;
  }

  // ── 공지사항 ──────────────────────────────

  async getNotices(page = 1, limit = 10) {
    const notices = await this.contentRepository.findNotices(page, limit);
    const total = await this.contentRepository.countNotices();
    return { notices, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async getNoticeById(id) {
    const notice = await this.contentRepository.findNoticeById(id);
    if (!notice) throw new NoticeError("공지사항을 찾을 수 없습니다.", 404);
    return notice;
  }

  async createNotice({ admin_id, title, content, is_pinned }) {
    Notice.validateRequired({ title, content });
    const notice = new Notice({ admin_id, title, content, is_pinned });
    return await this.contentRepository.saveNotice(notice);
  }

  async updateNotice(id, fields) {
    const notice = await this.contentRepository.findNoticeById(id);
    if (!notice) throw new NoticeError("공지사항을 찾을 수 없습니다.", 404);
    return await this.contentRepository.updateNotice(id, fields);
  }

  async deleteNotice(id) {
    const deleted = await this.contentRepository.deleteNotice(id);
    if (!deleted) throw new NoticeError("공지사항을 찾을 수 없습니다.", 404);
    return true;
  }
}

module.exports = ContentService;
