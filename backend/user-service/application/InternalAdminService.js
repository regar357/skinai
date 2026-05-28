const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || "http://localhost:3002";
const INTERNAL_TOKEN = process.env.INTERNAL_SERVICE_TOKEN || "internal-dev-token";

class InternalAdminService {
  constructor(pool) {
    this.pool = pool;
  }

  async getUsers({ page = 1, limit = 10, status }) {
    const offset = (page - 1) * limit;
    const params = [];
    let where = "";
    if (status) { where = "WHERE status = ?"; params.push(status); }
    const diagnosisDb = process.env.DIAGNOSIS_DB_NAME || "skinai_diagnosis";
    const [rows] = await this.pool.execute(
      `SELECT user_id, name, email, status, created_at, last_login_at,
              (SELECT COUNT(*) FROM \`${diagnosisDb}\`.diagnoses d WHERE d.user_id = users.user_id) AS diagnosis_count
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

  async deleteUser(userId) {
    await this.pool.execute("DELETE FROM users WHERE user_id = ?", [userId]);
    try {
      await fetch(`${AUTH_SERVICE_URL}/internal/users/${userId}`, {
        method: "DELETE",
        headers: { "x-internal-token": INTERNAL_TOKEN },
      });
    } catch { /* best-effort */ }
  }
}

module.exports = InternalAdminService;
