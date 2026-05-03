/**
 * ═══════════════════════════════════════════════
 * Monitoring Repository MySQL 구현체 (인프라 계층)
 * ═══════════════════════════════════════════════
 */
const MonitoringRepository = require("../../domain/MonitoringRepository");
const { ServiceSnapshot, DiagnosisStat } = require("../../domain/Monitoring");

class MonitoringRepositoryImpl extends MonitoringRepository {
  constructor(pool) { super(); this.pool = pool; }

  async saveSnapshot(snapshot) {
    const [result] = await this.pool.execute(
      "INSERT INTO service_snapshots (service_name, status, response_time_ms, checked_at) VALUES (?, ?, ?, NOW())",
      [snapshot.service_name, snapshot.status, snapshot.response_time_ms]
    );
    snapshot.snapshot_id = result.insertId;
    return snapshot;
  }

  async getRecentSnapshots(limit = 20) {
    const [rows] = await this.pool.execute(
      "SELECT * FROM service_snapshots ORDER BY checked_at DESC LIMIT ?",
      [String(limit)]
    );
    return rows.map(r => new ServiceSnapshot(r));
  }

  async getStats(days = 7) {
    const [rows] = await this.pool.execute(
      "SELECT * FROM diagnosis_stats ORDER BY stat_date DESC LIMIT ?",
      [String(days)]
    );
    return rows.map(r => new DiagnosisStat(r));
  }

  async upsertStat(stat) {
    const [result] = await this.pool.execute(
      `INSERT INTO diagnosis_stats (stat_date, total_diagnoses, completed, failed, avg_confidence, created_at)
       VALUES (?, ?, ?, ?, ?, NOW())
       ON DUPLICATE KEY UPDATE total_diagnoses = ?, completed = ?, failed = ?, avg_confidence = ?`,
      [stat.stat_date, stat.total_diagnoses, stat.completed, stat.failed, stat.avg_confidence,
       stat.total_diagnoses, stat.completed, stat.failed, stat.avg_confidence]
    );
    stat.stat_id = result.insertId;
    return stat;
  }
}

module.exports = MonitoringRepositoryImpl;
