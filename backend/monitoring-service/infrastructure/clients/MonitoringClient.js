class MonitoringClient {
  constructor() {
    this.diagnosisUrl =
      process.env.DIAGNOSIS_SERVICE_URL || "http://localhost:3004";
    this.userUrl = process.env.USER_SERVICE_URL || "http://localhost:3003";
    this.aiUrl = process.env.AI_SERVICE_URL || "http://localhost:8000";
    this.internalToken =
      process.env.INTERNAL_SERVICE_TOKEN || "internal-dev-token";
  }

  async get(url) {
    try {
      const res = await fetch(url, {
        headers: { "x-internal-token": this.internalToken },
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.message || `HTTP ${res.status}`);
      return json.body || json.data || json;
    } catch (e) {
      console.warn(
        "[monitoring-service] internal call failed:",
        url,
        e.message,
      );
      return null;
    }
  }

  getDiagnosisPerformance() {
    return this.get(`${this.diagnosisUrl}/internal/monitoring/performance`);
  }

  getAiPerformance() {
    return this.get(`${this.aiUrl}/api/admin/monitoring/performance`);
  }

  getDiseaseAccuracy() {
    return this.get(
      `${this.diagnosisUrl}/internal/monitoring/disease-accuracy`,
    );
  }

  getDailySummary() {
    return this.get(`${this.diagnosisUrl}/internal/monitoring/daily-summary`);
  }

  getAiModelInfo() {
    return this.get(`${this.aiUrl}/api/admin/monitoring/model-info`);
  }

  getAiSystemStatus() {
    return this.get(`${this.aiUrl}/api/admin/monitoring/system-status`);
  }

  // 대시보드용 내부 API
  getDiagnosisDashboardStats() {
    return this.get(`${this.diagnosisUrl}/internal/monitoring/dashboard/stats`);
  }

  getUserDashboardStats() {
    return this.get(`${this.userUrl}/internal/monitoring/dashboard/user-stats`);
  }
}

module.exports = MonitoringClient;
