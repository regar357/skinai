const { pool } = require("../db");
const NoticeRepository = require("../../domain/noticeRepository");

class NoticeRepositoryImpl extends NoticeRepository {
  async findAll({ page, size }) {
    const offset = (page - 1) * size;
    const [rows] = await pool.execute(
      "SELECT id, title, content, created_at FROM notices ORDER BY created_at DESC LIMIT ? OFFSET ?",
      [size, offset],
    );

    const [[countRow]] = await pool.execute(
      "SELECT COUNT(*) AS total FROM notices",
    );
    return {
      items: rows,
      total: countRow.total,
    };
  }

  async findById(id) {
    const [rows] = await pool.execute(
      "SELECT id, title, content, created_at, updated_at FROM notices WHERE id = ?",
      [id],
    );
    return rows[0] || null;
  }

  async create({ title, content }) {
    const [result] = await pool.execute(
      "INSERT INTO notices (title, content) VALUES (?, ?)",
      [title, content],
    );
    return result.insertId;
  }

  async update(id, { title, content }) {
    const [result] = await pool.execute(
      "UPDATE notices SET title = ?, content = ? WHERE id = ?",
      [title, content, id],
    );
    return result.affectedRows > 0;
  }

  async delete(id) {
    const [result] = await pool.execute("DELETE FROM notices WHERE id = ?", [
      id,
    ]);
    return result.affectedRows > 0;
  }
}

module.exports = new NoticeRepositoryImpl();
