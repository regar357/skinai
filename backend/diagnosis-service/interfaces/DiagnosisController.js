/**
 * ═══════════════════════════════════════════════
 * Analysis Controller (인터페이스 계층)
 * ═══════════════════════════════════════════════
 *
 * API 목록:
 *   POST   /api/v1/diagnoses              - 진단 생성 (이미지 업로드 + 분석 요청)
 *   GET    /api/v1/diagnoses/history       - 내 진단 이력
 *   GET    /api/v1/diagnoses/logs          - 분석 로그 조회 (관리자)
 *   GET    /api/v1/diagnoses/:id           - 진단 상세 조회
 *   DELETE /api/v1/diagnoses/:id           - 진단 단건 삭제
 *   DELETE /api/v1/diagnoses               - 진단 다건 삭제 ({ ids: [] })
 *   PUT    /api/v1/diagnoses/:id/complete  - 분석 완료 처리 (AI 서비스 콜백)
 *   GET    /api/v1/diagnoses/:id/logs      - 진단별 로그 조회
 */
class DiagnosisController {
  constructor(service) {
    this.service = service;
  }

  normalizeDiagnosis(raw) {
    return {
      diagnosisId: raw.diagnosis_id,
      userId: raw.user_id,
      diagnosisType: raw.diagnosis_type,
      imageUrl: raw.image_url,
      status: raw.status,
      createdAt: raw.created_at,
      images: raw.images,
      result: raw.result_summary
        ? {
            suspectedDisease: raw.result_summary,
            probability:
              raw.ai_confidence !== null && raw.ai_confidence !== undefined
                ? Math.round(Number(raw.ai_confidence) * 100)
                : undefined,
          }
        : undefined,
    };
  }

  formatHistoryItem(raw) {
    const createdAt = raw.created_at ? new Date(raw.created_at) : null;
    const formattedDate =
      createdAt && !Number.isNaN(createdAt.getTime())
        ? `${createdAt.getFullYear()}.${String(createdAt.getMonth() + 1).padStart(2, "0")}.${String(createdAt.getDate()).padStart(2, "0")}`
        : raw.created_at || "";

    return {
      id: raw.diagnosis_id,
      date: formattedDate,
      result: raw.result_summary || "분석중",
      score:
        raw.ai_confidence !== null && raw.ai_confidence !== undefined
          ? Math.round(Number(raw.ai_confidence) * 100)
          : 0,
      thumbnail: raw.image_url || "",
    };
  }

  // ── 진단 생성 ────────────────────────────
  create = async (req, res, next) => {
    try {
      const payload = {
        user_id: req.user.userId,
        diagnosis_type: req.body?.diagnosis_type || "skin",
        image_url: req.body?.image_url,
        file: req.file, // multer memory storage: buffer + metadata
      };
      const result = await this.service.createDiagnosis(payload);
      res.status(201).json(this.normalizeDiagnosis(result));
    } catch (e) {
      next(e);
    }
  };

  // ── 진단 상세 조회 ──────────────────────
  getById = async (req, res, next) => {
    try {
      const result = await this.service.getDiagnosisById(
        req.params.id,
        req.user.userId,
      );
      res
        .status(200)
        .json(this.normalizeDiagnosis({ ...result, images: result.images }));
    } catch (e) {
      next(e);
    }
  };

  // ── 내 진단 이력 (구 /me, 현 /history) ─
  getMyList = async (req, res, next) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.size) || parseInt(req.query.limit) || 10;
      const result = await this.service.getMyDiagnoses(
        req.user.userId,
        page,
        limit,
      );
      const items = result.diagnoses.map((diagnosis) =>
        this.formatHistoryItem(diagnosis),
      );
      res.status(200).json({
        items,
        pagination: {
          currentPage: result.pagination.page,
          totalPages: result.pagination.totalPages,
          totalItems: result.pagination.total,
          hasNext: result.pagination.page < result.pagination.totalPages,
          hasPrev: result.pagination.page > 1,
        },
      });
    } catch (e) {
      next(e);
    }
  };

  // ── 진단 단건 삭제 ──────────────────────
  deleteOne = async (req, res, next) => {
    try {
      await this.service.deleteDiagnosis(req.params.id, req.user.userId);
      res
        .status(200)
        .json({ success: true, message: "진단이 삭제되었습니다." });
    } catch (e) {
      next(e);
    }
  };

  // ── 진단 다건 삭제 ──────────────────────
  deleteMany = async (req, res, next) => {
    try {
      const ids = Array.isArray(req.body?.ids) ? req.body.ids : [];
      if (ids.length === 0) {
        return res.status(400).json({
          success: false,
          message: "삭제할 진단 ID 목록(ids)이 필요합니다.",
        });
      }
      await this.service.deleteDiagnosesMany(ids, req.user.userId);
      res.status(200).json({
        success: true,
        message: `${ids.length}건의 진단이 삭제되었습니다.`,
      });
    } catch (e) {
      next(e);
    }
  };

  // ── 분석 완료 처리 ──────────────────────
  complete = async (req, res, next) => {
    try {
      await this.service.completeDiagnosis(req.params.id, req.body);
      res
        .status(200)
        .json({ success: true, message: "분석이 완료되었습니다." });
    } catch (e) {
      next(e);
    }
  };

  // ── 분석 로그 조회 (관리자) ─────────────
  getLogs = async (req, res, next) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;
      const result = await this.service.getLogs(page, limit);
      res.status(200).json({
        success: true,
        data: result.logs,
        pagination: result.pagination,
      });
    } catch (e) {
      next(e);
    }
  };

  // ── 진단별 로그 조회 ────────────────────
  getLogsByDiagnosis = async (req, res, next) => {
    try {
      const logs = await this.service.getLogsByDiagnosisId(req.params.id);
      res.status(200).json({ success: true, data: logs });
    } catch (e) {
      next(e);
    }
  };
}

module.exports = DiagnosisController;
