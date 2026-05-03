/**
 * ═══════════════════════════════════════════════
 * Content Repository Interface (도메인 계층)
 * ═══════════════════════════════════════════════
 */
class ContentRepository {
  // 피부백과
  async findArticleById(id) { throw new Error("구현 필요"); }
  async findArticles(page, limit, category) { throw new Error("구현 필요"); }
  async saveArticle(article) { throw new Error("구현 필요"); }
  async updateArticle(id, fields) { throw new Error("구현 필요"); }
  async deleteArticle(id) { throw new Error("구현 필요"); }
  async countArticles(category) { throw new Error("구현 필요"); }
  async incrementViewCount(id) { throw new Error("구현 필요"); }

  // 공지사항
  async findNoticeById(id) { throw new Error("구현 필요"); }
  async findNotices(page, limit) { throw new Error("구현 필요"); }
  async saveNotice(notice) { throw new Error("구현 필요"); }
  async updateNotice(id, fields) { throw new Error("구현 필요"); }
  async deleteNotice(id) { throw new Error("구현 필요"); }
  async countNotices() { throw new Error("구현 필요"); }
}

module.exports = ContentRepository;
