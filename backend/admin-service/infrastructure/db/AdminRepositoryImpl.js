/**
 * ═══════════════════════════════════════════════
 * Admin Repository MySQL 구현체 (인프라 계층)
 * ═══════════════════════════════════════════════
 */
const AdminRepository = require("../../domain/AdminRepository");
const { Admin } = require("../../domain/Admin");

class AdminRepositoryImpl extends AdminRepository {
  constructor(pool) { super(); this.pool = pool; }

  async findById(adminId) {
    const [rows] = await this.pool.execute("SELECT * FROM admins WHERE admin_id = ?", [adminId]);
    return rows.length ? new Admin(rows[0]) : null;
  }

  async findByUserId(userId) {
    const [rows] = await this.pool.execute("SELECT * FROM admins WHERE user_id = ?", [userId]);
    return rows.length ? new Admin(rows[0]) : null;
  }

  async save(admin) {
    const [result] = await this.pool.execute(
      "INSERT INTO admins (user_id, permissions, created_at) VALUES (?, ?, NOW())",
      [admin.user_id, JSON.stringify(admin.permissions)]
    );
    admin.admin_id = result.insertId;
    return admin;
  }
}

module.exports = AdminRepositoryImpl;
