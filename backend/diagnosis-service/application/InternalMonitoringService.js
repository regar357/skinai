class InternalMonitoringService {
  constructor(pool) {
    this.pool = pool;
  }

  pct(value) {
    return Math.round(Number(value || 0) * 100) / 100;
  }

  async getPerformance() {
    const [rows] = await this.pool.query(
      `SELECT DATE_FORMAT(created_at, '%Y-%m') AS month,
              COUNT(*) AS total,
              SUM(status='completed') AS completed,
              SUM(status='failed') AS failed,
              AVG(CASE WHEN ai_confidence IS NULL THEN 0 ELSE ai_confidence END) AS accuracy
         FROM diagnoses
        WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
        GROUP BY month
        ORDER BY month`,
    );

    return rows.map((r) => {
      const total = Number(r.total) || 1;
      const completed = Number(r.completed) || 0;
      const failed = Number(r.failed) || 0;
      const precision = (completed / total) * 100;
      const recall = completed + failed ? (completed / (completed + failed)) * 100 : 0;
      const f1Score = precision + recall ? (2 * precision * recall) / (precision + recall) : 0;

      return {
        month: r.month,
        accuracy: this.pct(r.accuracy),
        precision: this.pct(precision),
        recall: this.pct(recall),
        f1Score: this.pct(f1Score),
      };
    });
  }

  async getDiseaseAccuracy() {
    const [rows] = await this.pool.query(
      `SELECT COALESCE(NULLIF(result_summary, ''), 'unknown') AS name,
              AVG(CASE WHEN ai_confidence IS NULL THEN 0 ELSE ai_confidence END) AS value
         FROM diagnoses
        WHERE status='completed'
        GROUP BY name
        ORDER BY value DESC`,
    );
    return rows.map((r) => ({ name: r.name, value: this.pct(r.value) }));
  }

  async getDailySummary() {
    const [[row]] = await this.pool.query(
      `SELECT COUNT(*) AS dailyRequests,
              SUM(status='failed') AS failed
         FROM diagnoses
        WHERE DATE(created_at)=CURDATE()`,
    );
    const total = Number(row.dailyRequests) || 0;
    const failed = Number(row.failed) || 0;
    return {
      dailyRequests: total,
      errorRate: total ? this.pct((failed / total) * 100) : 0,
    };
  }
}

module.exports = InternalMonitoringService;
