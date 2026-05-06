const { pool } = require("../db");
const EncyclopediaRepository = require("../../domain/encyclopediaRepository");

class EncyclopediaRepositoryImpl extends EncyclopediaRepository {
  async findAll({ query, page, size }) {
    const offset = (page - 1) * size;
    const queryCondition = query ? "WHERE title LIKE ? OR content LIKE ?" : "";
    const queryParams = query
      ? [`%${query}%`, `%${query}%`, size, offset]
      : [size, offset];

    const [rows] = await pool.execute(
      `SELECT id, title, content FROM encyclopedia ${queryCondition} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      queryParams,
    );

    const countQuery = query
      ? "SELECT COUNT(*) AS total FROM encyclopedia WHERE title LIKE ? OR content LIKE ?"
      : "SELECT COUNT(*) AS total FROM encyclopedia";
    const countParams = query ? [`%${query}%`, `%${query}%`] : [];
    const [[countRow]] = await pool.execute(countQuery, countParams);

    return {
      items: rows,
      total: countRow.total,
    };
  }

  async findById(id) {
    const [rows] = await pool.execute(
      "SELECT id, title, content, created_at, updated_at FROM encyclopedia WHERE id = ?",
      [id],
    );
    return rows[0] || null;
  }

  async create({ title, content }) {
    const [result] = await pool.execute(
      "INSERT INTO encyclopedia (title, content) VALUES (?, ?)",
      [title, content],
    );
    return result.insertId;
  }

  async update(id, { title, content }) {
    const [result] = await pool.execute(
      "UPDATE encyclopedia SET title = ?, content = ? WHERE id = ?",
      [title, content, id],
    );
    return result.affectedRows > 0;
  }

  async delete(id) {
    const [result] = await pool.execute(
      "DELETE FROM encyclopedia WHERE id = ?",
      [id],
    );
    return result.affectedRows > 0;
  }
}

module.exports = new EncyclopediaRepositoryImpl();
