/**
 * ═══════════════════════════════════════════════
 * Admin Controller (인터페이스 계층)
 * ═══════════════════════════════════════════════
 * 
 * 서비스 통신(내부 API) - 다른 서비스들의 데이터를 집계/프록시
 * 
 * API 목록:
 *   GET /api/admin/overview - 전체 서비스 상태 개요
 */
class AdminController {
  constructor(serviceClient) { this.serviceClient = serviceClient; }

  // ── 서비스 개요 조회 (내부 API 통신) ─────
  getOverview = async (req, res, next) => {
    try {
      const token = req.token;

      // 병렬로 각 서비스 호출
      const [articles, notices] = await Promise.all([
        this.serviceClient.getArticles(1, 5),
        this.serviceClient.getNotices(1, 5),
      ]);

      res.status(200).json({
        success: true,
        data: {
          articles: articles.data || [],
          notices: notices.data || [],
        },
      });
    } catch (e) { next(e); }
  };
}

module.exports = AdminController;
