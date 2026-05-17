class InternalAdminService {
  constructor(pool) {
    this.pool = pool;
    this._migrate();
  }

  async _migrate() {
    try {
      await this.pool.execute(
        "ALTER TABLE feedbacks ADD COLUMN IF NOT EXISTS reply_text TEXT DEFAULT NULL",
      );
      await this.pool.execute(
        "ALTER TABLE feedbacks ADD COLUMN IF NOT EXISTS replied_at DATETIME DEFAULT NULL",
      );
    } catch (e) {
      console.warn("[feedback-service] migration warning:", e.message);
    }
  }

  async getFeedbacks({ page = 1, limit = 10 }) {
    const offset = (page - 1) * limit;
    const [rows] = await this.pool.execute(
      `SELECT feedback_id, user_id, diagnosis_id, rating, content,
              reply_text, replied_at, created_at
       FROM feedbacks ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      [String(limit), String(offset)],
    );
    const [[{ total }]] = await this.pool.query(
      "SELECT COUNT(*) AS total FROM feedbacks",
    );
    return {
      data: rows,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async replyFeedback(feedbackId, replyText) {
    await this.pool.execute(
      "UPDATE feedbacks SET reply_text = ?, replied_at = NOW() WHERE feedback_id = ?",
      [replyText, feedbackId],
    );
    const [rows] = await this.pool.execute(
      "SELECT feedback_id, user_id, rating, content, reply_text, replied_at FROM feedbacks WHERE feedback_id = ?",
      [feedbackId],
    );
    return rows[0] || { feedback_id: Number(feedbackId), reply_text: replyText };
  }
}

module.exports = InternalAdminService;
