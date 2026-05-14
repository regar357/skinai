/**
 * ═══════════════════════════════════════════════
 * Service Client (인프라 계층)
 * ═══════════════════════════════════════════════
 *
 * 관리자 서비스 → 다른 마이크로서비스 내부 API 호출 클라이언트
 */
class ServiceClient {
  constructor() {
    this.authServiceUrl =
      process.env.AUTH_SERVICE_URL || "http://localhost:3002";
    this.userServiceUrl =
      process.env.USER_SERVICE_URL || "http://localhost:3003";
    this.diagnosisServiceUrl =
      process.env.DIAGNOSIS_SERVICE_URL || "http://localhost:3004";
    this.contentServiceUrl =
      process.env.CONTENT_SERVICE_URL || "http://localhost:3005";
    this.feedbackServiceUrl =
      process.env.FEEDBACK_SERVICE_URL || "http://localhost:3007";
    this.monitoringServiceUrl =
      process.env.MONITORING_SERVICE_URL || "http://localhost:3009";
  }

  async _request(url, options = {}) {
    try {
      const response = await fetch(url, {
        headers: { "Content-Type": "application/json", ...options.headers },
        ...options,
      });
      const json = await response.json().catch(() => ({}));
      if (!response.ok) {
        const err = new Error(json.message || `Upstream ${response.status}`);
        err.statusCode = response.status;
        throw err;
      }
      return json;
    } catch (error) {
      if (error.statusCode) throw error;
      console.error(
        `[admin-service] Service call failed: ${url}`,
        error.message,
      );
      const wrapped = new Error(`서비스 연결 실패: ${url}`);
      wrapped.statusCode = 503;
      throw wrapped;
    }
  }

  _authHeader(token) {
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  // ── 인증 서비스 ──────────────────────────
  async login(payload) {
    return this._request(`${this.authServiceUrl}/api/v1/auth/login`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  // ── 분석(진단) 서비스 ────────────────────
  async getDiagnosisLogs(token, page = 1, limit = 20) {
    return this._request(
      `${this.diagnosisServiceUrl}/api/v1/diagnoses/logs?page=${page}&limit=${limit}`,
      { headers: this._authHeader(token) },
    );
  }

  // ── 콘텐츠 서비스 (피부백과/공지) ───────
  async getEncyclopediaArticles(page = 1, limit = 10) {
    return this._request(
      `${this.contentServiceUrl}/api/v1/encyclopedia?page=${page}&limit=${limit}`,
    );
  }

  async getEncyclopediaArticle(id) {
    return this._request(`${this.contentServiceUrl}/api/v1/encyclopedia/${id}`);
  }

  async createEncyclopediaArticle(payload, token) {
    return this._request(`${this.contentServiceUrl}/api/v1/encyclopedia`, {
      method: "POST",
      headers: this._authHeader(token),
      body: JSON.stringify(payload),
    });
  }

  async updateEncyclopediaArticle(id, payload, token) {
    return this._request(
      `${this.contentServiceUrl}/api/v1/encyclopedia/${id}`,
      {
        method: "PUT",
        headers: this._authHeader(token),
        body: JSON.stringify(payload),
      },
    );
  }

  async deleteEncyclopediaArticle(id, token) {
    return this._request(
      `${this.contentServiceUrl}/api/v1/encyclopedia/${id}`,
      {
        method: "DELETE",
        headers: this._authHeader(token),
      },
    );
  }

  async getNotices(page = 1, limit = 10) {
    return this._request(
      `${this.contentServiceUrl}/api/v1/notices?page=${page}&limit=${limit}`,
    );
  }

  async createNotice(payload, token) {
    return this._request(`${this.contentServiceUrl}/api/v1/notices`, {
      method: "POST",
      headers: this._authHeader(token),
      body: JSON.stringify(payload),
    });
  }

  async updateNotice(id, payload, token) {
    return this._request(`${this.contentServiceUrl}/api/v1/notices/${id}`, {
      method: "PUT",
      headers: this._authHeader(token),
      body: JSON.stringify(payload),
    });
  }

  async deleteNotice(id, token) {
    return this._request(`${this.contentServiceUrl}/api/v1/notices/${id}`, {
      method: "DELETE",
      headers: this._authHeader(token),
    });
  }
}

module.exports = ServiceClient;
