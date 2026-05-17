const FeedbackRepository = require("../../domain/interfaces/FeedbackRepository");
const { Feedback } = require("../../domain/entities/Feedback");

class FeedbackRepositoryImpl extends FeedbackRepository {
  constructor(pool) {
    super();
    this.pool = pool;
  }

  async findById(feedbackId, userId) {
    const [rows] = await this.pool.execute(
      `SELECT feedback_id, user_id, rating, content, reply_text, replied_at, created_at, updated_at
       FROM feedbacks WHERE feedback_id = ? AND user_id = ?`,
      [feedbackId, userId],
    );
    return rows.length ? new Feedback(rows[0]) : null;
  }

  async findByUserId(userId, page, limit) {
    const offset = (page - 1) * limit;
    const [rows] = await this.pool.execute(
      `SELECT feedback_id, user_id, rating, content, reply_text, replied_at, created_at, updated_at
       FROM feedbacks WHERE user_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      [userId, String(limit), String(offset)],
    );
    return rows.map((row) => new Feedback(row));
  }

  async countByUserId(userId) {
    const [[{ total }]] = await this.pool.execute(
      "SELECT COUNT(*) AS total FROM feedbacks WHERE user_id = ?",
      [userId],
    );
    return total;
  }

  async save(feedback) {
    const [result] = await this.pool.execute(
      `INSERT INTO feedbacks (user_id, rating, content, created_at, updated_at)
       VALUES (?, ?, ?, NOW(), NOW())`,
      [feedback.user_id, feedback.rating, feedback.content],
    );
    feedback.feedback_id = result.insertId;
    return feedback;
  }

  async update(feedbackId, userId, fields) {
    const updates = [];
    const params = [];
    if (fields.rating !== undefined) { updates.push("rating = ?"); params.push(fields.rating); }
    if (fields.content !== undefined) { updates.push("content = ?"); params.push(fields.content); }
    if (!updates.length) return false;
    updates.push("updated_at = NOW()");
    params.push(feedbackId, userId);
    const [result] = await this.pool.execute(
      `UPDATE feedbacks SET ${updates.join(", ")} WHERE feedback_id = ? AND user_id = ?`,
      params,
    );
    return result.affectedRows > 0;
  }

  async delete(feedbackId, userId) {
    const [result] = await this.pool.execute(
      "DELETE FROM feedbacks WHERE feedback_id = ? AND user_id = ?",
      [feedbackId, userId],
    );
    return result.affectedRows > 0;
  }
}

module.exports = FeedbackRepositoryImpl;
