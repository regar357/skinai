const FeedbackRepository = require("../../domain/FeedbackRepository");
const { Feedback } = require("../../domain/Feedback");

/**
 * MySQL 기반 FeedbackRepository 구현체 (인프라 계층)
 */
class FeedbackRepositoryImpl extends FeedbackRepository {
  constructor(pool) {
    super();
    this.pool = pool;
  }

  async findById(feedbackId, userId) {
    const [rows] = await this.pool.execute(
      `SELECT feedback_id, diagnosis_id, user_id, rating, content, created_at, updated_at
       FROM feedbacks
       WHERE feedback_id = ? AND user_id = ?`,
      [feedbackId, userId]
    );
    if (rows.length === 0) return null;
    return new Feedback(rows[0]);
  }

  async findByUserId(userId, page, limit) {
    const offset = (page - 1) * limit;
    const [rows] = await this.pool.execute(
      `SELECT feedback_id, diagnosis_id, user_id, rating, content, created_at, updated_at
       FROM feedbacks
       WHERE user_id = ?
       ORDER BY created_at DESC
       LIMIT ? OFFSET ?`,
      [userId, String(limit), String(offset)]
    );
    return rows.map((row) => new Feedback(row));
  }

  async findByDiagnosisAndUser(diagnosisId, userId) {
    const [rows] = await this.pool.execute(
      `SELECT feedback_id, diagnosis_id, user_id, rating, content, created_at, updated_at
       FROM feedbacks
       WHERE diagnosis_id = ? AND user_id = ?`,
      [diagnosisId, userId]
    );
    if (rows.length === 0) return null;
    return new Feedback(rows[0]);
  }

  async countByUserId(userId) {
    const [rows] = await this.pool.execute(
      "SELECT COUNT(*) as total FROM feedbacks WHERE user_id = ?",
      [userId]
    );
    return rows[0].total;
  }

  async save(feedback) {
    const [result] = await this.pool.execute(
      `INSERT INTO feedbacks (diagnosis_id, user_id, rating, content, created_at, updated_at)
       VALUES (?, ?, ?, ?, NOW(), NOW())`,
      [feedback.diagnosis_id, feedback.user_id, feedback.rating, feedback.content]
    );
    feedback.feedback_id = result.insertId;
    return feedback;
  }

  async update(feedbackId, userId, fields) {
    const updates = [];
    const params = [];

    if (fields.rating !== undefined) {
      updates.push("rating = ?");
      params.push(fields.rating);
    }
    if (fields.content !== undefined) {
      updates.push("content = ?");
      params.push(fields.content);
    }

    if (updates.length === 0) return false;

    updates.push("updated_at = NOW()");
    params.push(feedbackId, userId);

    const [result] = await this.pool.execute(
      `UPDATE feedbacks SET ${updates.join(", ")} WHERE feedback_id = ? AND user_id = ?`,
      params
    );
    return result.affectedRows > 0;
  }

  async delete(feedbackId, userId) {
    const [result] = await this.pool.execute(
      "DELETE FROM feedbacks WHERE feedback_id = ? AND user_id = ?",
      [feedbackId, userId]
    );
    return result.affectedRows > 0;
  }

  async existsByDiagnosisAndUser(diagnosisId, userId) {
    const [rows] = await this.pool.execute(
      "SELECT 1 FROM feedbacks WHERE diagnosis_id = ? AND user_id = ? LIMIT 1",
      [diagnosisId, userId]
    );
    return rows.length > 0;
  }
}

module.exports = FeedbackRepositoryImpl;
