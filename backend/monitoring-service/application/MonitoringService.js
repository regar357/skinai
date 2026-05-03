/**
 * ═══════════════════════════════════════════════
 * Monitoring Application Service (응용 계층)
 * ═══════════════════════════════════════════════
 * 
 * 기능:
 *   - AI 진단 모니터링 → 분석 로그 데이터 → 서비스 통신
 *   - 대시보드 → 사용자 정보 → 서비스 통신
 */
class MonitoringService {
  constructor(monitoringClient, pool) {
    this.monitoringClient = monitoringClient;
    this.pool = pool;
  }

  // ── AI 진단 로그 조회 (서비스 통신) ───────
  async getAiLogs(token, page, limit) {
    return await this.monitoringClient.getDiagnosisLogs(token, page, limit);
  }

  // ── 진단별 로그 조회 ──────────────────────
  async getLogsByDiagnosis(token, diagnosisId) {
    return await this.monitoringClient.getDiagnosisLogs(token, diagnosisId);
  }

  // ── 대시보드 데이터 조회 ──────────────────
  async getDashboard() {
    const [diagnosisHealth, userHealth] = await Promise.all([
      this.monitoringClient.getDiagnosisHealth(),
      this.monitoringClient.getUserHealth(),
    ]);

    let stats = [];
    try {
      const [rows] = await this.pool.execute(
        "SELECT * FROM diagnosis_stats ORDER BY stat_date DESC LIMIT 7"
      );
      stats = rows;
    } catch (err) {
      console.warn("[monitoring-service] 통계 조회 실패:", err.message);
    }

    return {
      services: { diagnosis: diagnosisHealth, user: userHealth },
      stats,
      timestamp: new Date().toISOString(),
    };
  }

  // ── 전체 서비스 헬스체크 ──────────────────
  async healthCheckAll() {
    const services = [
      { name: "diagnosis-service", check: () => this.monitoringClient.getDiagnosisHealth() },
      { name: "user-service", check: () => this.monitoringClient.getUserHealth() },
    ];

    return await Promise.all(
      services.map(async (s) => {
        const start = Date.now();
        try {
          const result = await s.check();
          return { name: s.name, status: result.status || "UP", responseTime: Date.now() - start };
        } catch {
          return { name: s.name, status: "DOWN", responseTime: Date.now() - start };
        }
      })
    );
  }
}

module.exports = MonitoringService;
