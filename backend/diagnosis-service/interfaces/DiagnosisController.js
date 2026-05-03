/**
 * ═══════════════════════════════════════════════
 * Analysis Controller (인터페이스 계층)
 * ═══════════════════════════════════════════════
 * 
 * API 목록:
 *   POST   /api/diagnoses              - 진단 생성 (이미지 업로드 + 분석 요청)
 *   GET    /api/diagnoses/me            - 내 진단 목록
 *   GET    /api/diagnoses/shared/:token - 공유 링크로 결과 조회
 *   GET    /api/diagnoses/logs          - 분석 로그 조회 (관리자)
 *   GET    /api/diagnoses/:id           - 진단 상세 조회
 *   PUT    /api/diagnoses/:id/complete  - 분석 완료 처리 (AI 서비스 콜백)
 *   POST   /api/diagnoses/:id/share     - 공유 링크 생성
 *   GET    /api/diagnoses/:id/logs      - 진단별 로그 조회
 */
class DiagnosisController {
  constructor(service) { this.service = service; }

  // ── 진단 생성 ────────────────────────────
  create = async (req, res, next) => {
    try {
      const result = await this.service.createDiagnosis({
        user_id: req.user.userId,
        ...req.body,
      });
      res.status(201).json({ success: true, message: "진단 요청이 생성되었습니다.", data: result });
    } catch (e) { next(e); }
  };

  // ── 진단 상세 조회 ──────────────────────
  getById = async (req, res, next) => {
    try {
      const result = await this.service.getDiagnosisById(req.params.id, req.user.userId);
      res.status(200).json({ success: true, data: result });
    } catch (e) { next(e); }
  };

  // ── 내 진단 목록 ────────────────────────
  getMyList = async (req, res, next) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const result = await this.service.getMyDiagnoses(req.user.userId, page, limit);
      res.status(200).json({ success: true, data: result.diagnoses, pagination: result.pagination });
    } catch (e) { next(e); }
  };

  // ── 분석 완료 처리 ──────────────────────
  complete = async (req, res, next) => {
    try {
      await this.service.completeDiagnosis(req.params.id, req.body);
      res.status(200).json({ success: true, message: "분석이 완료되었습니다." });
    } catch (e) { next(e); }
  };

  // ── 공유 링크 생성 ──────────────────────
  createShare = async (req, res, next) => {
    try {
      const expiresInHours = req.body.expires_in_hours || 72;
      const result = await this.service.createShareLink(req.params.id, req.user.userId, expiresInHours);
      res.status(201).json({ success: true, message: "공유 링크가 생성되었습니다.", data: result });
    } catch (e) { next(e); }
  };

  // ── 공유 링크로 조회 ────────────────────
  getByShareToken = async (req, res, next) => {
    try {
      const result = await this.service.getDiagnosisByShareToken(req.params.token);
      res.status(200).json({ success: true, data: result });
    } catch (e) { next(e); }
  };

  // ── 분석 로그 조회 (관리자) ─────────────
  getLogs = async (req, res, next) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;
      const result = await this.service.getLogs(page, limit);
      res.status(200).json({ success: true, data: result.logs, pagination: result.pagination });
    } catch (e) { next(e); }
  };

  // ── 진단별 로그 조회 ────────────────────
  getLogsByDiagnosis = async (req, res, next) => {
    try {
      const logs = await this.service.getLogsByDiagnosisId(req.params.id);
      res.status(200).json({ success: true, data: logs });
    } catch (e) { next(e); }
  };
}

module.exports = DiagnosisController;
