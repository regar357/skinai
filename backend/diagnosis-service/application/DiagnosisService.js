/**
 * ═══════════════════════════════════════════════
 * Analysis Application Service (응용 계층)
 * ═══════════════════════════════════════════════
 *
 * 통합 기능:
 *   - 이미지 업로드 → S3 저장
 *   - 분석 수행 (AI 서비스 호출)
 *   - 분석 결과 CRUD
 *   - 분석 결과 공유 (공유 링크 생성)
 *   - 분석 로그 기록
 */
const { Diagnosis, DomainError } = require("../domain/entities/Diagnosis");
const { Image } = require("../domain/entities/Image");
const { ShareLink } = require("../domain/entities/ShareLink");
const { DiagnosisLog } = require("../domain/entities/DiagnosisLog");
const { v4: uuidv4 } = require("uuid");
const aiClient = require("../infrastructure/ai/aiClient");

class DiagnosisService {
  constructor(diagnosisRepository) {
    this.diagnosisRepository = diagnosisRepository;
    this.aiServiceUrl = process.env.AI_SERVICE_URL || "http://localhost:8001";
  }

  // ─────────────────────────────────────────────
  // 진단 생성 + 이미지 저장 + AI 분석 요청
  // POST /api/v1/diagnoses
  // ─────────────────────────────────────────────
  async createDiagnosis({ user_id, diagnosis_type, image_url, file }) {
    const diagnosis = Diagnosis.createNew({
      user_id,
      diagnosis_type,
      image_url,
    });
    const saved = await this.diagnosisRepository.saveDiagnosis(diagnosis);

    let resultSummary = null;
    let confidenceFraction = null;
    let finalStatus = saved.status;

    // 이미지 메타데이터 저장 (파일 업로드인 경우 placeholder URL 사용)
    if (file) {
      const placeholderUrl = `upload://${uuidv4()}`;
      const image = new Image({
        user_id,
        diagnosis_id: saved.diagnosis_id,
        original_url: placeholderUrl,
        file_size: file.size,
        mime_type: file.mimetype,
      });
      await this.diagnosisRepository.saveImage(image);

      try {
        const aiResponse = await aiClient.sendImage(
          file.buffer,
          file.mimetype,
          file.originalname || "image.jpg",
        );
        const responseData = aiResponse?.data ?? aiResponse;
        const success =
          aiResponse?.success !== undefined ? aiResponse.success : true;
        if (!success || !responseData) {
          throw new Error(
            `AI 응답이 유효하지 않습니다. body=${JSON.stringify(aiResponse)}`,
          );
        }

        resultSummary =
          responseData.diseaseName ||
          responseData.disease_name ||
          responseData.label ||
          "unknown";
        const rawConfidence = Number(
          responseData.probability ?? responseData.confidence ?? 0,
        );
        confidenceFraction = Number.isFinite(rawConfidence)
          ? rawConfidence <= 1
            ? rawConfidence
            : rawConfidence / 100
          : null;

        finalStatus = "completed";
        await this.diagnosisRepository.updateDiagnosis(saved.diagnosis_id, {
          status: finalStatus,
          result_summary: resultSummary,
          ai_confidence: confidenceFraction,
        });

        await this.diagnosisRepository.saveLog(
          DiagnosisLog.create({
            diagnosis_id: saved.diagnosis_id,
            user_id,
            action: "completed",
            detail: `AI 결과: ${resultSummary} (${rawConfidence}%)`,
          }),
        );
      } catch (err) {
        console.error("AI 전송 실패:", err.message || err);
        finalStatus = "failed";
        await this.diagnosisRepository.updateDiagnosis(saved.diagnosis_id, {
          status: finalStatus,
        });
        await this.diagnosisRepository.saveLog(
          DiagnosisLog.create({
            diagnosis_id: saved.diagnosis_id,
            user_id,
            action: "ai_error",
            detail: err.message || String(err),
          }),
        );
      }
    } else if (image_url) {
      const image = new Image({
        user_id,
        diagnosis_id: saved.diagnosis_id,
        original_url: image_url,
      });
      await this.diagnosisRepository.saveImage(image);
    }

    // 로그 기록
    await this.diagnosisRepository.saveLog(
      DiagnosisLog.create({
        diagnosis_id: saved.diagnosis_id,
        user_id,
        action: "created",
        detail: `진단 타입: ${diagnosis_type}`,
      }),
    );

    return {
      ...saved,
      status: finalStatus,
      result_summary: resultSummary || saved.result_summary,
      ai_confidence: confidenceFraction ?? saved.ai_confidence,
    };
  }

  // ─────────────────────────────────────────────
  // 진단 상세 조회
  // GET /api/v1/diagnoses/:id
  // ─────────────────────────────────────────────
  async getDiagnosisById(id, userId) {
    const d = await this.diagnosisRepository.findDiagnosisById(id);
    if (!d) throw new DomainError("진단 기록을 찾을 수 없습니다.", 404);
    if (d.user_id !== userId)
      throw new DomainError("접근 권한이 없습니다.", 403);

    // 관련 이미지도 함께 조회
    const images = await this.diagnosisRepository.findImagesByDiagnosisId(id);
    return { ...d, images };
  }

  // ─────────────────────────────────────────────
  // 내 진단 이력 조회
  // GET /api/v1/diagnoses/history
  // ─────────────────────────────────────────────
  async getMyDiagnoses(userId, page = 1, limit = 10) {
    const diagnoses = await this.diagnosisRepository.findDiagnosesByUserId(
      userId,
      page,
      limit,
    );
    const total = await this.diagnosisRepository.countDiagnosesByUserId(userId);
    return {
      diagnoses,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  // ─────────────────────────────────────────────
  // 진단 단건 삭제
  // DELETE /api/v1/diagnoses/:id
  // ─────────────────────────────────────────────
  async deleteDiagnosis(id, userId) {
    const d = await this.diagnosisRepository.findDiagnosisById(id);
    if (!d) throw new DomainError("진단 기록을 찾을 수 없습니다.", 404);
    if (d.user_id !== userId)
      throw new DomainError("접근 권한이 없습니다.", 403);

    await this.diagnosisRepository.deleteDiagnosis(id);

    await this.diagnosisRepository.saveLog(
      DiagnosisLog.create({
        diagnosis_id: id,
        user_id: userId,
        action: "deleted",
        detail: "사용자 삭제",
      }),
    );
    return true;
  }

  // ─────────────────────────────────────────────
  // 진단 다건 삭제
  // DELETE /api/v1/diagnoses  body: { ids: [...] }
  // ─────────────────────────────────────────────
  async deleteDiagnosesMany(ids, userId) {
    for (const id of ids) {
      const d = await this.diagnosisRepository.findDiagnosisById(id);
      if (!d) continue;
      if (d.user_id !== userId) {
        throw new DomainError(
          `진단 ID ${id}에 대한 접근 권한이 없습니다.`,
          403,
        );
      }
      await this.diagnosisRepository.deleteDiagnosis(id);
      await this.diagnosisRepository.saveLog(
        DiagnosisLog.create({
          diagnosis_id: id,
          user_id: userId,
          action: "deleted",
          detail: "사용자 다건 삭제",
        }),
      );
    }
    return true;
  }

  // ─────────────────────────────────────────────
  // 분석 완료 처리 (AI 서비스 콜백)
  // PUT /api/v1/diagnoses/:id/complete
  // ─────────────────────────────────────────────
  async completeDiagnosis(id, { result_summary, ai_confidence }) {
    const updated = await this.diagnosisRepository.updateDiagnosis(id, {
      result_summary,
      ai_confidence,
      status: "completed",
    });

    // 로그 기록
    await this.diagnosisRepository.saveLog(
      DiagnosisLog.create({
        diagnosis_id: id,
        user_id: 0,
        action: "completed",
        detail: `신뢰도: ${ai_confidence}`,
      }),
    );

    return updated;
  }

  // ─────────────────────────────────────────────
  // 분석 결과 공유 링크 생성
  // POST /api/v1/diagnoses/:id/share
  // ─────────────────────────────────────────────
  async createShareLink(diagnosisId, userId, expiresInHours = 72) {
    const d = await this.diagnosisRepository.findDiagnosisById(diagnosisId);
    if (!d) throw new DomainError("진단 기록을 찾을 수 없습니다.", 404);
    if (d.user_id !== userId)
      throw new DomainError("접근 권한이 없습니다.", 403);

    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + expiresInHours);

    const shareLink = new ShareLink({
      diagnosis_id: diagnosisId,
      user_id: userId,
      share_token: uuidv4(),
      expires_at: expiresAt,
    });

    const saved = await this.diagnosisRepository.saveShareLink(shareLink);

    // 로그 기록
    await this.diagnosisRepository.saveLog(
      DiagnosisLog.create({
        diagnosis_id: diagnosisId,
        user_id: userId,
        action: "shared",
        detail: `만료: ${expiresInHours}시간`,
      }),
    );

    return saved;
  }

  // ─────────────────────────────────────────────
  // 공유 링크로 분석 결과 조회
  // GET /api/v1/diagnoses/shared/:token
  // ─────────────────────────────────────────────
  async getDiagnosisByShareToken(token) {
    const link = await this.diagnosisRepository.findShareLinkByToken(token);
    if (!link) throw new DomainError("유효하지 않은 공유 링크입니다.", 404);
    if (link.isExpired()) throw new DomainError("만료된 공유 링크입니다.", 410);

    const d = await this.diagnosisRepository.findDiagnosisById(
      link.diagnosis_id,
    );
    const images = await this.diagnosisRepository.findImagesByDiagnosisId(
      link.diagnosis_id,
    );
    return { ...d, images };
  }

  // ─────────────────────────────────────────────
  // 분석 로그 조회 (모니터링용 - 내부 API)
  // GET /api/v1/diagnoses/logs
  // ─────────────────────────────────────────────
  async getLogs(page = 1, limit = 20) {
    const logs = await this.diagnosisRepository.findAllLogs(page, limit);
    const total = await this.diagnosisRepository.countAllLogs();
    return {
      logs,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async getLogsByDiagnosisId(diagnosisId) {
    return await this.diagnosisRepository.findLogsByDiagnosisId(diagnosisId);
  }
}

module.exports = DiagnosisService;
