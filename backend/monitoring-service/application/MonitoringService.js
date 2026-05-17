const DEFAULT_STATUS = {
  averageResponseTime: 0,
  dailyRequests: 0,
  errorRate: 0,
  uptime: 0,
};

class MonitoringService {
  constructor({ client }) {
    this.client = client;
  }

  async getPerformanceMetrics() {
    const live = await this.client.getDiagnosisPerformance();
    if (!Array.isArray(live) || !live.length) return [];
    return live.map((m) => ({
      month: m.month,
      "정확도": Number(m.accuracy),
      "정밀도": Number(m.precision),
      "재현율": Number(m.recall),
      "F1점수": Number(m.f1Score),
    }));
  }

  async getDiseaseAccuracy() {
    return (await this.client.getDiseaseAccuracy()) || [];
  }

  async getSystemStatus() {
    const [daily, aiStatus] = await Promise.all([
      this.client.getDailySummary(),
      this.client.getAiSystemStatus(),
    ]);
    return {
      averageResponseTime: Number(aiStatus?.averageResponseTime || 0),
      dailyRequests: Number(daily?.dailyRequests || aiStatus?.dailyRequests || 0),
      errorRate: Number(daily?.errorRate || aiStatus?.errorRate || 0),
      uptime: Number(aiStatus?.uptime || 0),
    };
  }

  async getModelInfo() {
    return (await this.client.getAiModelInfo()) || {
      modelVersion: process.env.AI_MODEL_VERSION || "unknown",
      lastTrained: process.env.AI_MODEL_LAST_TRAINED || "unknown",
      dataset: process.env.AI_MODEL_DATASET || "unknown",
      architecture: process.env.AI_MODEL_ARCH || "YOLOv8",
      inputSize: process.env.AI_MODEL_INPUT_SIZE || "unknown",
      classes: process.env.AI_MODEL_CLASSES || "unknown",
    };
  }

  async getDashboardStats() {
    const [diagStats, userStats] = await Promise.all([
      this.client.getDiagnosisDashboardStats(),
      this.client.getUserDashboardStats(),
    ]);
    return {
      totalUsers: userStats?.totalUsers || 0,
      activeUsers: userStats?.activeUsers || 0,
      totalAnalyses: diagStats?.totalAnalyses || 0,
      todayAnalyses: diagStats?.todayAnalyses || 0,
    };
  }

  async getDiagnosisTrend() {
    const diagStats = await this.client.getDiagnosisDashboardStats();
    return diagStats?.diagnosisTrend || [];
  }

  async getDiseaseDistribution() {
    const diagStats = await this.client.getDiagnosisDashboardStats();
    return diagStats?.diseaseDistribution || [];
  }

  async getUserTrend() {
    const userStats = await this.client.getUserDashboardStats();
    return userStats?.userTrend || [];
  }
}

module.exports = MonitoringService;
