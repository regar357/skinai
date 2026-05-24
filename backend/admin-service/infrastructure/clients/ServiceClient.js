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
    this.internalToken =
      process.env.INTERNAL_SERVICE_TOKEN || "internal-dev-token";
  }

  async _request(url, options = {}) {
    const { headers: optHeaders = {}, ...restOptions } = options;
    try {
      const response = await fetch(url, {
        headers: { "Content-Type": "application/json", ...optHeaders },
        ...restOptions,
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

  _internalHeader() {
    return { "x-internal-token": this.internalToken };
  }

  async _internalGet(url) {
    try {
      const res = await fetch(url, { headers: this._internalHeader() });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.message || `HTTP ${res.status}`);
      return json.data ?? json;
    } catch (e) {
      console.warn("[admin-service] internal call failed:", url, e.message);
      return null;
    }
  }

  async _internalPost(url, body) {
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { ...this._internalHeader(), "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.message || `HTTP ${res.status}`);
      return json.data ?? json;
    } catch (e) {
      console.warn("[admin-service] internal call failed:", url, e.message);
      return null;
    }
  }

  async _internalPatch(url, body = {}) {
    try {
      const res = await fetch(url, {
        method: "PATCH",
        headers: { ...this._internalHeader(), "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.message || `HTTP ${res.status}`);
      return json.data ?? json;
    } catch (e) {
      console.warn("[admin-service] internal call failed:", url, e.message);
      return null;
    }
  }

  async _internalDelete(url) {
    try {
      const res = await fetch(url, {
        method: "DELETE",
        headers: this._internalHeader(),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.message || `HTTP ${res.status}`);
      return json;
    } catch (e) {
      console.warn("[admin-service] internal call failed:", url, e.message);
      return null;
    }
  }

  // ── 사용자 서비스 내부 관리 API ──────────
  getAdminUsers(page, limit, status) {
    const qs = `page=${page}&limit=${limit}${status ? `&status=${status}` : ""}`;
    return this._internalGet(`${this.userServiceUrl}/internal/admin/users?${qs}`);
  }

  suspendAdminUser(userId) {
    return this._internalPatch(`${this.userServiceUrl}/internal/admin/users/${userId}/suspend`);
  }

  unsuspendAdminUser(userId) {
    return this._internalPatch(`${this.userServiceUrl}/internal/admin/users/${userId}/unsuspend`);
  }

  deleteAdminUser(userId) {
    return this._internalDelete(`${this.userServiceUrl}/internal/admin/users/${userId}`);
  }

  // ── 피드백 서비스 내부 관리 API ──────────
  getAdminFeedbacks(page, limit) {
    return this._internalGet(`${this.feedbackServiceUrl}/internal/admin/feedbacks?page=${page}&limit=${limit}`);
  }

  replyAdminFeedback(feedbackId, replyText) {
    return this._internalPost(`${this.feedbackServiceUrl}/internal/admin/feedbacks/${feedbackId}/reply`, { reply_text: replyText });
  }

  // ── 진단 서비스 내부 관리 API ────────────
  getAdminExamRecords(page, limit, search) {
    const qs = `page=${page}&limit=${limit}${search ? `&search=${encodeURIComponent(search)}` : ""}`;
    return this._internalGet(`${this.diagnosisServiceUrl}/internal/admin/analyses/records?${qs}`);
  }

  getAdminImageInfo(imageId) {
    return this._internalGet(`${this.diagnosisServiceUrl}/internal/admin/analyses/images/${imageId}`);
  }

  // ── 모니터링 서비스 내부 API ─────────────
  getMonitoringDashboardStats() {
    return this._internalGet(`${this.monitoringServiceUrl}/internal/admin/dashboard/stats`);
  }

  getMonitoringDiagnosisTrend() {
    return this._internalGet(`${this.monitoringServiceUrl}/internal/admin/dashboard/diagnosis-trend`);
  }

  getMonitoringDiseaseDistribution() {
    return this._internalGet(`${this.monitoringServiceUrl}/internal/admin/dashboard/disease-distribution`);
  }

  getMonitoringUserTrend() {
    return this._internalGet(`${this.monitoringServiceUrl}/internal/admin/dashboard/user-trend`);
  }

  getMonitoringPerformance() {
    return this._internalGet(`${this.monitoringServiceUrl}/internal/admin/monitoring/performance`);
  }

  getMonitoringDiseaseAccuracy() {
    return this._internalGet(`${this.monitoringServiceUrl}/internal/admin/monitoring/disease-accuracy`);
  }

  getMonitoringSystemStatus() {
    return this._internalGet(`${this.monitoringServiceUrl}/internal/admin/monitoring/system-status`);
  }

  getMonitoringModelInfo() {
    return this._internalGet(`${this.monitoringServiceUrl}/internal/admin/monitoring/model-info`);
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
    const { description, ...rest } = payload;
    const body = { ...rest, content: rest.content || description };
    return this._request(`${this.contentServiceUrl}/api/v1/encyclopedia`, {
      method: "POST",
      headers: this._authHeader(token),
      body: JSON.stringify(body),
    });
  }

  async updateEncyclopediaArticle(id, payload, token) {
    const { description, ...rest } = payload;
    const body = { ...rest, content: rest.content || description };
    return this._request(
      `${this.contentServiceUrl}/api/v1/encyclopedia/${id}`,
      {
        method: "PUT",
        headers: this._authHeader(token),
        body: JSON.stringify(body),
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
