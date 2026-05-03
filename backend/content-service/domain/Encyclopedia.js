/**
 * ═══════════════════════════════════════════════
 * Encyclopedia Entity (도메인 계층)
 * ═══════════════════════════════════════════════
 * 
 * 피부백과 데이터
 */
class Encyclopedia {
  constructor({ article_id, title, content, category, image_url, view_count, created_at, updated_at }) {
    this.article_id = article_id || null;
    this.title = title;
    this.content = content;
    this.category = category || null;
    this.image_url = image_url || null;
    this.view_count = view_count || 0;
    this.created_at = created_at || null;
    this.updated_at = updated_at || null;
  }

  static validateRequired({ title, content }) {
    if (!title || !content) throw new DomainError("제목과 내용은 필수입니다.");
  }
}

class DomainError extends Error {
  constructor(msg, code = 400) { super(msg); this.statusCode = code; }
}

module.exports = { Encyclopedia, DomainError };
