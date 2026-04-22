const { analysisRepository: analysisRepositoryContract } = require("../../domain/repositories/analysisRepository");
const { getPool } = require("../db/mysql");

const analysisRepository = {
  ...analysisRepositoryContract,

  async create({
    userId,
    imageUrl,
    thumbnailUrl,
    gender,
    age,
    overallScore,
    status,
    summary,
    details,
    recommendations,
  }) {
    const pool = getPool();
    const [result] = await pool.query(
      `
        INSERT INTO analysis_results (
          user_id,
          image_url,
          thumbnail_url,
          gender,
          age,
          overall_score,
          status,
          summary,
          detail_moisture,
          detail_uv,
          detail_barrier,
          detail_sebum,
          recommendations_json
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        userId,
        imageUrl,
        thumbnailUrl,
        gender,
        age,
        overallScore,
        status,
        summary,
        details.moisture,
        details.uv,
        details.barrier,
        details.sebum,
        JSON.stringify(recommendations),
      ],
    );

    const [rows] = await pool.query(
      "SELECT * FROM analysis_results WHERE analysis_id = ?",
      [result.insertId],
    );
    return rows[0];
  },

  async findAllForUser({ userId, page, limit, sortBy, order }) {
    const normalizedPage = Math.max(Number(page) || 1, 1);
    const normalizedLimit = Math.max(Math.min(Number(limit) || 10, 100), 1);
    const offset = (normalizedPage - 1) * normalizedLimit;
    const pool = getPool();
    const normalizedSortBy = sortBy === "score" ? "overall_score" : "created_at";
    const normalizedOrder = String(order).toLowerCase() === "asc" ? "ASC" : "DESC";

    const [rows] = await pool.query(
      `
        SELECT *
        FROM analysis_results
        WHERE user_id = ?
        ORDER BY ${normalizedSortBy} ${normalizedOrder}
        LIMIT ? OFFSET ?
      `,
      [userId, normalizedLimit, offset],
    );

    const [countRows] = await pool.query(
      "SELECT COUNT(*) AS totalItems FROM analysis_results WHERE user_id = ?",
      [userId],
    );

    const totalItems = countRows[0].totalItems;

    return {
      items: rows,
      pagination: {
        currentPage: normalizedPage,
        totalPages: Math.max(Math.ceil(totalItems / normalizedLimit), 1),
        totalItems,
        itemsPerPage: normalizedLimit,
      },
    };
  },

  async findByIdForUser({ analysisId, userId }) {
    const pool = getPool();
    const [rows] = await pool.query(
      "SELECT * FROM analysis_results WHERE analysis_id = ? AND user_id = ? LIMIT 1",
      [analysisId, userId],
    );

    return rows[0] ?? null;
  },

  async deleteManyByIds({ analysisIds, userId }) {
    const pool = getPool();
    const placeholders = analysisIds.map(() => "?").join(", ");
    const [result] = await pool.query(
      `DELETE FROM analysis_results WHERE user_id = ? AND analysis_id IN (${placeholders})`,
      [userId, ...analysisIds],
    );

    return result.affectedRows ?? 0;
  },
};

module.exports = {
  analysisRepository,
};
