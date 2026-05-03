/**
 * ═══════════════════════════════════════════════
 * Notice Entity (도메인 계층)
 * ═══════════════════════════════════════════════
 * 
 * 공지사항 데이터
 */
class Notice {
  constructor({ notice_id, admin_id, title, content, is_pinned, created_at, updated_at }) {
    this.notice_id = notice_id || null;
    this.admin_id = admin_id;
    this.title = title;
    this.content = content;
    this.is_pinned = is_pinned || false;
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

module.exports = { Notice, DomainError };
