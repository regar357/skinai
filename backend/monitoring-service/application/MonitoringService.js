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
    const toPercent = (v) => Math.round(Number(v) * 1000) / 10;
    const toMonth = (dateStr) => {
      const d = new Date(dateStr);
      return isNaN(d.getTime()) ? dateStr : `${d.getMonth() + 1}월`;
    };
    const mapAiData = (arr) =>
      arr.map((m) => ({
        month: m.evaluatedAt ? toMonth(m.evaluatedAt) : (m.month || ""),
        "정확도": toPercent(m.accuracy),
        "정밀도": toPercent(m.precision),
        "재현율": toPercent(m.recall),
        "F1점수": toPercent(m.f1Score),
      }));

    // AI 서버 성능 지표 우선 사용
    const aiData = await this.client.getAiPerformance();
    if (Array.isArray(aiData) && aiData.length) {
      return mapAiData(aiData);
    }

    // 폴백: diagnosis-service 내부 API
    const live = await this.client.getDiagnosisPerformance();
    if (Array.isArray(live) && live.length) {
      return live.map((m) => ({
        month: m.month,
        "정확도": Number(m.accuracy),
        "정밀도": Number(m.precision),
        "재현율": Number(m.recall),
        "F1점수": Number(m.f1Score),
      }));
    }

    // 최종 폴백: main.py 정적 데이터 (AI 서버 미가동 환경)
    return mapAiData([
      { accuracy: 0.995, precision: 0.991, recall: 0.992, f1Score: 0.991, evaluatedAt: "2026-05-16" },
      { accuracy: 0.982, precision: 0.978, recall: 0.980, f1Score: 0.979, evaluatedAt: "2026-06-16" },
      { accuracy: 0.985, precision: 0.982, recall: 0.983, f1Score: 0.982, evaluatedAt: "2026-07-16" },
      { accuracy: 0.989, precision: 0.987, recall: 0.988, f1Score: 0.987, evaluatedAt: "2026-08-16" },
    ]);
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
