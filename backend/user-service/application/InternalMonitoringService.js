class InternalMonitoringService {
  constructor(pool) {
    this.pool = pool;
  }

  async getUserDashboardStats() {
    const [[totals]] = await this.pool.query(
      `SELECT COUNT(*) AS totalUsers,
              SUM(status='active') AS activeUsers
         FROM users`,
    );

    const [trendRows] = await this.pool.query(
      `SELECT DATE_FORMAT(created_at, '%Y-%m') AS month,
              COUNT(*) AS new,
              SUM(status='active') AS active
         FROM users
        WHERE created_at >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
        GROUP BY month ORDER BY month`,
    );

    return {
      totalUsers: Number(totals.totalUsers) || 0,
      activeUsers: Number(totals.activeUsers) || 0,
      userTrend: trendRows.map((r) => ({
        month: r.month,
        new: Number(r.new),
        active: Number(r.active),
      })),
    };
  }
}

module.exports = InternalMonitoringService;
