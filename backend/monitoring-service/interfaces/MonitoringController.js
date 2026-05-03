/**
 * ═══════════════════════════════════════════════
 * Monitoring Controller (인터페이스 계층)
 * ═══════════════════════════════════════════════
 * 
 * API 목록:
 *   GET /api/monitoring/ai-logs       - AI 진단 모니터링 (분석 로그 조회)
 *   GET /api/monitoring/ai-logs/:id   - 진단별 로그 조회
 *   GET /api/monitoring/dashboard     - 대시보드 (서비스 상태 + 사용자 통계)
 *   GET /api/monitoring/health-check  - 전체 서비스 헬스체크
 */
class MonitoringController {
  constructor(monitoringClient, pool) {
    this.monitoringClient = monitoringClient;
    this.pool = pool;
  }

  // ── AI 진단 모니터링: 분석 로그 데이터 조회 ──
  getAiLogs = async (req, res, next) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;
      const result = await this.monitoringClient.getAnalysisLogs(req.token, page, limit);
      res.status(200).json({
        success: true,
        message: "AI 진단 로그 조회 성공",
        data: result.data || [],
        pagination: result.pagination || {},
      });
    } catch (e) { next(e); }
  };

  // ── 진단별 로그 상세 조회 ─────────────────────
  getAiLogsByDiagnosis = async (req, res, next) => {
    try {
      const result = await this.monitoringClient.getDiagnosisLogs(req.token, req.params.id);
      res.status(200).json({
        success: true,
        message: "진단별 로그 조회 성공",
        data: result.data || [],
      });
    } catch (e) { next(e); }
  };

  // ── 대시보드: 서비스 상태 + 통계 ─────────────
  getDashboard = async (req, res, next) => {
    try {
      // 서비스 헬스체크 병렬 호출
      const [diagnosisHealth, userHealth] = await Promise.all([
        this.monitoringClient.getDiagnosisHealth(),
        this.monitoringClient.getUserHealth(),
      ]);

      // 로컬 DB에서 진단 통계 조회
      let stats = [];
      try {
        const [rows] = await this.pool.execute(
          "SELECT * FROM diagnosis_stats ORDER BY stat_date DESC LIMIT 7"
        );
        stats = rows;
      } catch (dbErr) {
        console.warn("[monitoring-service] 통계 테이블 조회 실패:", dbErr.message);
      }

      res.status(200).json({
        success: true,
        data: {
          services: {
            diagnosis: diagnosisHealth,
            user: userHealth,
          },
          stats,
          timestamp: new Date().toISOString(),
        },
      });
    } catch (e) { next(e); }
  };

  // ── 전체 서비스 헬스체크 ──────────────────────
  healthCheck = async (req, res, next) => {
    try {
      const services = [
        { name: "diagnosis-service", check: () => this.monitoringClient.getDiagnosisHealth() },
        { name: "user-service", check: () => this.monitoringClient.getUserHealth() },
      ];

      const results = await Promise.all(
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

      res.status(200).json({ success: true, data: results, timestamp: new Date().toISOString() });
    } catch (e) { next(e); }
  };
}

module.exports = MonitoringController;
