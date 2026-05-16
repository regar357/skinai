const DEFAULT_STATUS = {
  averageResponseTime: 0,
  dailyRequests: 0,
  errorRate: 0,
  uptime: 0,
};

class MonitoringService {
  constructor({ client, repository }) {
    this.client = client;
    this.repository = repository;
  }

  async getPerformanceMetrics() {
    const live = await this.client.getDiagnosisPerformance();
    if (Array.isArray(live) && live.length) {
      await this.repository.savePerformanceMetrics(live);
      return live.map((m) => ({
        month: m.month,
        "정확도": Number(m.accuracy),
        "정밀도": Number(m.precision),
        "재현율": Number(m.recall),
        "F1점수": Number(m.f1Score),
      }));
    }
    return this.repository.getPerformanceMetrics();
  }

  async getDiseaseAccuracy() {
    const live = await this.client.getDiseaseAccuracy();
    if (Array.isArray(live) && live.length) {
      await this.repository.saveDiseaseAccuracy(live);
      return live;
    }
    return this.repository.getDiseaseAccuracy();
  }

  async getSystemStatus() {
    const [daily, aiStatus] = await Promise.all([
      this.client.getDailySummary(),
      this.client.getAiSystemStatus(),
    ]);
    const live = {
      averageResponseTime: Number(aiStatus?.averageResponseTime || 0),
      dailyRequests: Number(daily?.dailyRequests || aiStatus?.dailyRequests || 0),
      errorRate: Number(daily?.errorRate || aiStatus?.errorRate || 0),
      uptime: Number(aiStatus?.uptime || 0),
    };

    if (Object.values(live).some((v) => v > 0)) {
      await this.repository.saveSystemStatus(live);
      return live;
    }

    return (await this.repository.getSystemStatus()) || DEFAULT_STATUS;
  }

  async getModelInfo() {
    return (
      (await this.client.getAiModelInfo()) || {
        modelVersion: process.env.AI_MODEL_VERSION || "unknown",
        lastTrained: process.env.AI_MODEL_LAST_TRAINED || "unknown",
        dataset: process.env.AI_MODEL_DATASET || "unknown",
        architecture: process.env.AI_MODEL_ARCH || "YOLOv8",
        inputSize: process.env.AI_MODEL_INPUT_SIZE || "unknown",
        classes: process.env.AI_MODEL_CLASSES || "unknown",
      }
    );
  }
}

module.exports = MonitoringService;
