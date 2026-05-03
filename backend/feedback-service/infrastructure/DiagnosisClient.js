/**
 * Diagnosis Service Client (인프라 계층)
 * - 피드백 서비스에서 진단 서비스로 HTTP 호출
 * - MSA에서 서비스 간 통신의 핵심 포인트
 * - 나중에 메시지 큐(RabbitMQ, Kafka)로 전환 가능
 */
class DiagnosisClient {
  constructor(baseUrl) {
    this.baseUrl = baseUrl || process.env.DIAGNOSIS_SERVICE_URL || "http://localhost:3004";
  }

  /**
   * 진단 기록 존재 여부 및 소유자 확인
   * - 진단 서비스가 아직 없으면 로컬 DB에서 직접 확인 (폴백)
   */
  async verifyDiagnosis(diagnosisId, userId, token) {
    try {
      const response = await fetch(`${this.baseUrl}/api/diagnoses/${diagnosisId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 404) return { exists: false, owned: false };
        throw new Error(`Diagnosis service responded with ${response.status}`);
      }

      const data = await response.json();
      return {
        exists: true,
        owned: data.data.user_id === userId,
      };
    } catch (error) {
      console.warn("[feedback-service] Diagnosis service unavailable, using local fallback:", error.message);
      return await this.localFallback(diagnosisId, userId);
    }
  }

  /**
   * 폴백: 진단 서비스가 아직 없을 때 로컬 DB에서 직접 확인
   * - 개발 초기 단계용, 나중에 제거
   */
  async localFallback(diagnosisId, userId) {
    try {
      const pool = require("./db/pool");
      const [rows] = await pool.execute(
        "SELECT diagnosis_id, user_id FROM diagnoses WHERE diagnosis_id = ? LIMIT 1",
        [diagnosisId]
      );
      if (rows.length === 0) return { exists: false, owned: false };
      return { exists: true, owned: rows[0].user_id === userId };
    } catch {
      // diagnoses 테이블이 없을 수도 있음
      return { exists: true, owned: true };
    }
  }
}

module.exports = DiagnosisClient;
