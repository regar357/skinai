/**
 * ═══════════════════════════════════════════════
 * Content Repository MySQL 구현체 (인프라 계층)
 * ═══════════════════════════════════════════════
 */
const ContentRepository = require("../../domain/ContentRepository");
const { Encyclopedia } = require("../../domain/Encyclopedia");
const { Notice } = require("../../domain/Notice");

class ContentRepositoryImpl extends ContentRepository {
  constructor(pool) { super(); this.pool = pool; }

  // ── 피부백과 ──────────────────────────────

  async findArticleById(id) {
    const [rows] = await this.pool.execute("SELECT * FROM articles WHERE article_id = ?", [id]);
    return rows.length ? new Encyclopedia(rows[0]) : null;
  }

  async findArticles(page, limit, category) {
    const offset = (page - 1) * limit;
    let query = "SELECT * FROM articles";
    const params = [];
    if (category) { query += " WHERE category = ?"; params.push(category); }
    query += " ORDER BY created_at DESC LIMIT ? OFFSET ?";
    params.push(String(limit), String(offset));
    const [rows] = await this.pool.execute(query, params);
    return rows.map(r => new Encyclopedia(r));
  }

  async saveArticle(a) {
    const [result] = await this.pool.execute(
      "INSERT INTO articles (title, content, category, image_url, created_at, updated_at) VALUES (?, ?, ?, ?, NOW(), NOW())",
      [a.title, a.content, a.category, a.image_url]
    );
    a.article_id = result.insertId;
    return a;
  }

  async updateArticle(id, fields) {
    const updates = []; const params = [];
    for (const [k, v] of Object.entries(fields)) {
      if (v !== undefined) { updates.push(`${k} = ?`); params.push(v); }
    }
    if (!updates.length) return false;
    updates.push("updated_at = NOW()");
    params.push(id);
    const [r] = await this.pool.execute(`UPDATE articles SET ${updates.join(", ")} WHERE article_id = ?`, params);
    return r.affectedRows > 0;
  }

  async deleteArticle(id) {
    const [r] = await this.pool.execute("DELETE FROM articles WHERE article_id = ?", [id]);
    return r.affectedRows > 0;
  }

  async countArticles(category) {
    let query = "SELECT COUNT(*) as total FROM articles";
    const params = [];
    if (category) { query += " WHERE category = ?"; params.push(category); }
    const [rows] = await this.pool.execute(query, params);
    return rows[0].total;
  }

  async incrementViewCount(id) {
    await this.pool.execute("UPDATE articles SET view_count = view_count + 1 WHERE article_id = ?", [id]);
  }

  // ── 공지사항 ──────────────────────────────

  async findNoticeById(id) {
    const [rows] = await this.pool.execute("SELECT * FROM notices WHERE notice_id = ?", [id]);
    return rows.length ? new Notice(rows[0]) : null;
  }

  async findNotices(page, limit) {
    const offset = (page - 1) * limit;
    const [rows] = await this.pool.execute(
      "SELECT * FROM notices ORDER BY is_pinned DESC, created_at DESC LIMIT ? OFFSET ?",
      [String(limit), String(offset)]
    );
    return rows.map(r => new Notice(r));
  }

  async saveNotice(n) {
    const [result] = await this.pool.execute(
      "INSERT INTO notices (admin_id, title, content, is_pinned, created_at, updated_at) VALUES (?, ?, ?, ?, NOW(), NOW())",
      [n.admin_id, n.title, n.content, n.is_pinned]
    );
    n.notice_id = result.insertId;
    return n;
  }

  async updateNotice(id, fields) {
    const updates = []; const params = [];
    for (const [k, v] of Object.entries(fields)) {
      if (v !== undefined) { updates.push(`${k} = ?`); params.push(v); }
    }
    if (!updates.length) return false;
    updates.push("updated_at = NOW()");
    params.push(id);
    const [r] = await this.pool.execute(`UPDATE notices SET ${updates.join(", ")} WHERE notice_id = ?`, params);
    return r.affectedRows > 0;
  }

  async deleteNotice(id) {
    const [r] = await this.pool.execute("DELETE FROM notices WHERE notice_id = ?", [id]);
    return r.affectedRows > 0;
  }

  async countNotices() {
    const [rows] = await this.pool.execute("SELECT COUNT(*) as total FROM notices");
    return rows[0].total;
  }
}

module.exports = ContentRepositoryImpl;
