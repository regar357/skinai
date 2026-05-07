/**
 * ═══════════════════════════════════════════════
 * Admin Application Service (응용 계층)
 * ═══════════════════════════════════════════════
 * 
 * 기능: 서비스 통신 (내부 API) - 각 서비스 데이터 집계
 */
class AdminService {
  constructor(serviceClient) {
    this.serviceClient = serviceClient;
  }

  // ── 서비스 개요 조회 ──────────────────────
  async getOverview(token) {
    const [articles, notices] = await Promise.all([
      this.serviceClient.getArticles(1, 5),
      this.serviceClient.getNotices(1, 5),
    ]);

    return {
      articles: articles.data || [],
      notices: notices.data || [],
    };
  }

  // ── 진단 로그 조회 ────────────────────────
  async getDiagnosisLogs(token, page, limit) {
    return await this.serviceClient.getDiagnosisLogs(token, page, limit);
  }
}

module.exports = AdminService;
