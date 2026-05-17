class InternalAdminService {
  constructor(pool) {
    this.pool = pool;
  }

  async getUsers({ page = 1, limit = 10, status }) {
    const offset = (page - 1) * limit;
    const params = [];
    let where = "";
    if (status) { where = "WHERE status = ?"; params.push(status); }
    const [rows] = await this.pool.execute(
      `SELECT user_id, name, email, status, created_at, last_login_at
       FROM users ${where} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      [...params, String(limit), String(offset)],
    );
    const [[{ total }]] = await this.pool.query(
      `SELECT COUNT(*) AS total FROM users ${where}`,
      params,
    );
    return {
      data: rows,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async updateStatus(userId, status) {
    await this.pool.execute(
      "UPDATE users SET status = ?, updated_at = NOW() WHERE user_id = ?",
      [status, userId],
    );
    const [rows] = await this.pool.execute(
      "SELECT user_id, name, email, status FROM users WHERE user_id = ?",
      [userId],
    );
    return rows[0] || { user_id: Number(userId), status };
  }
}

module.exports = InternalAdminService;
