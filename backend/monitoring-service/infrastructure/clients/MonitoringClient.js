/**
 * ═══════════════════════════════════════════════
 * Monitoring Service Client (인프라 계층)
 * ═══════════════════════════════════════════════
 * 
 * 모니터링 서비스에서 다른 서비스로 내부 API 호출
 * - 분석 서비스: 분석 로그 데이터 조회
 * - 사용자 서비스: 사용자 정보 조회
 */
class MonitoringClient {
  constructor() {
    this.diagnosisServiceUrl = process.env.DIAGNOSIS_SERVICE_URL || "http://localhost:3004";
    this.userServiceUrl = process.env.USER_SERVICE_URL || "http://localhost:3003";
  }

  async _request(url, options = {}) {
    try {
      const response = await fetch(url, {
        headers: { "Content-Type": "application/json", ...options.headers },
        ...options,
      });
      if (!response.ok) {
        return { success: false, message: `서비스 응답 오류: ${response.status}` };
      }
      return await response.json();
    } catch (error) {
      console.error(`[monitoring-service] Service call failed: ${url}`, error.message);
      return { success: false, message: `서비스 연결 실패: ${url}` };
    }
  }

  // ── 분석 로그 데이터 조회 (AI 진단 모니터링) ──
  async getDiagnosisLogs(token, page = 1, limit = 20) {
    return this._request(
      `${this.diagnosisServiceUrl}/api/diagnoses/logs?page=${page}&limit=${limit}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
  }

  // ── 진단별 로그 조회 ──────────────────────────
  async getDiagnosisLogs(token, diagnosisId) {
    return this._request(
      `${this.diagnosisServiceUrl}/api/diagnoses/${diagnosisId}/logs`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
  }

  // ── 분석 서비스 헬스체크 ──────────────────────
  async getDiagnosisHealth() {
    return this._request(`${this.diagnosisServiceUrl}/health`);
  }

  // ── 사용자 서비스 헬스체크 ────────────────────
  async getUserHealth() {
    return this._request(`${this.userServiceUrl}/health`);
  }
}

module.exports = MonitoringClient;
