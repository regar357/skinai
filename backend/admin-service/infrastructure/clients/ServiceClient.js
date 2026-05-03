/**
 * ═══════════════════════════════════════════════
 * Service Client (인프라 계층)
 * ═══════════════════════════════════════════════
 * 
 * 관리자 서비스에서 다른 서비스로 내부 API 호출
 * - 사용자 서비스, 분석 서비스, 콘텐츠 서비스, 피드백 서비스
 */
class ServiceClient {
  constructor() {
    this.userServiceUrl = process.env.USER_SERVICE_URL || "http://localhost:3003";
    this.diagnosisServiceUrl = process.env.DIAGNOSIS_SERVICE_URL || "http://localhost:3004";
    this.contentServiceUrl = process.env.CONTENT_SERVICE_URL || "http://localhost:3005";
    this.feedbackServiceUrl = process.env.FEEDBACK_SERVICE_URL || "http://localhost:3007";
  }

  async _request(url, options = {}) {
    try {
      const response = await fetch(url, {
        headers: { "Content-Type": "application/json", ...options.headers },
        ...options,
      });
      return await response.json();
    } catch (error) {
      console.error(`[admin-service] Service call failed: ${url}`, error.message);
      return { success: false, message: `서비스 연결 실패: ${url}` };
    }
  }

  // ── 사용자 서비스 통신 ────────────────────
  async getUserInfo(token) {
    return this._request(`${this.userServiceUrl}/api/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  // ── 분석 서비스 통신 ──────────────────────
  async getDiagnosisLogs(token, page = 1, limit = 20) {
    return this._request(`${this.diagnosisServiceUrl}/api/diagnoses/logs?page=${page}&limit=${limit}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  // ── 콘텐츠 서비스 통신 ────────────────────
  async getArticles(page = 1, limit = 10) {
    return this._request(`${this.contentServiceUrl}/api/content/encyclopedia?page=${page}&limit=${limit}`);
  }

  async getNotices(page = 1, limit = 10) {
    return this._request(`${this.contentServiceUrl}/api/content/notices?page=${page}&limit=${limit}`);
  }

  // ── 피드백 서비스 통신 ────────────────────
  async getFeedbacks(token, page = 1, limit = 10) {
    return this._request(`${this.feedbackServiceUrl}/api/feedbacks/me?page=${page}&limit=${limit}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }
}

module.exports = ServiceClient;
