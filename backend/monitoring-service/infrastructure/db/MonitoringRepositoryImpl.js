const MonitoringRepository = require("../../domain/interfaces/MonitoringRepository");

const safe = async (fn, fallback) => {
  try {
    return await fn();
  } catch (e) {
    console.warn("[monitoring-service] repository fallback:", e.code || e.message);
    return fallback;
  }
};

class MonitoringRepositoryImpl extends MonitoringRepository {
  constructor(pool) {
    super();
    this.pool = pool;
  }

  async getPerformanceMetrics() {
    return safe(async () => {
      const [rows] = await this.pool.query(
        `SELECT metric_month, accuracy, precision_score, recall_score, f1_score
           FROM performance_metrics ORDER BY metric_month ASC`,
      );
      return rows.map((r) => ({
        month: r.metric_month,
        "정확도": Number(r.accuracy),
        "정밀도": Number(r.precision_score),
        "재현율": Number(r.recall_score),
        "F1점수": Number(r.f1_score),
      }));
    }, []);
  }

  async savePerformanceMetrics(items = []) {
    return safe(async () => {
      for (const item of items) {
        await this.pool.execute(
          `INSERT INTO performance_metrics
           (metric_month, accuracy, precision_score, recall_score, f1_score)
           VALUES (?, ?, ?, ?, ?)
           ON DUPLICATE KEY UPDATE
             accuracy = VALUES(accuracy),
             precision_score = VALUES(precision_score),
             recall_score = VALUES(recall_score),
             f1_score = VALUES(f1_score)`,
          [item.month, item.accuracy, item.precision, item.recall, item.f1Score],
        );
      }
    }, undefined);
  }

  async getDiseaseAccuracy() {
    return safe(async () => {
      const [rows] = await this.pool.query(
        `SELECT disease_name, accuracy
           FROM disease_accuracy_metrics ORDER BY accuracy DESC`,
      );
      return rows.map((r) => ({ name: r.disease_name, value: Number(r.accuracy) }));
    }, []);
  }

  async saveDiseaseAccuracy(items = []) {
    return safe(async () => {
      for (const item of items) {
        await this.pool.execute(
          `INSERT INTO disease_accuracy_metrics (disease_name, accuracy, measured_at)
           VALUES (?, ?, NOW())
           ON DUPLICATE KEY UPDATE accuracy = VALUES(accuracy), measured_at = NOW()`,
          [item.name, item.value],
        );
      }
    }, undefined);
  }

  async getSystemStatus() {
    return safe(async () => {
      const [rows] = await this.pool.query(
        `SELECT average_response_time, daily_requests, error_rate, uptime
           FROM system_status_metrics ORDER BY measured_at DESC LIMIT 1`,
      );
      if (!rows.length) return null;
      const r = rows[0];
      return {
        averageResponseTime: Number(r.average_response_time),
        dailyRequests: Number(r.daily_requests),
        errorRate: Number(r.error_rate),
        uptime: Number(r.uptime),
      };
    }, null);
  }

  async saveSystemStatus(status) {
    return safe(async () => {
      await this.pool.execute(
        `INSERT INTO system_status_metrics
         (average_response_time, daily_requests, error_rate, uptime)
         VALUES (?, ?, ?, ?)`,
        [
          status.averageResponseTime,
          status.dailyRequests,
          status.errorRate,
          status.uptime,
        ],
      );
    }, undefined);
  }
}

module.exports = MonitoringRepositoryImpl;
