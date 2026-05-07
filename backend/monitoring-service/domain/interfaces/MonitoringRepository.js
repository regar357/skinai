/**
 * ═══════════════════════════════════════════════
 * Monitoring Repository Interface (도메인 계층)
 * ═══════════════════════════════════════════════
 */
class MonitoringRepository {
  async saveSnapshot(snapshot) { throw new Error("구현 필요"); }
  async getRecentSnapshots(limit) { throw new Error("구현 필요"); }
  async getStats(days) { throw new Error("구현 필요"); }
  async upsertStat(stat) { throw new Error("구현 필요"); }
}

module.exports = MonitoringRepository;
