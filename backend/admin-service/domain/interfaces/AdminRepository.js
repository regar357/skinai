/**
 * ═══════════════════════════════════════════════
 * AdminRepository 인터페이스 (도메인 계층)
 * ═══════════════════════════════════════════════
 */
class AdminRepository {
  // 사용자 관리
  async findUsers(_) {
    throw new Error("not implemented");
  }
  async updateUserStatus() {
    throw new Error("not implemented");
  }

  // 피드백 관리
  async findFeedbacks(_) {
    throw new Error("not implemented");
  }
  async saveFeedbackReply() {
    throw new Error("not implemented");
  }

  // 분석/이미지 관리
  async findExamRecords(_) {
    throw new Error("not implemented");
  }
  async findImageById() {
    throw new Error("not implemented");
  }

  // 대시보드 / 모니터링
  async getDashboardStats() {
    throw new Error("not implemented");
  }
  async getDiagnosisTrend() {
    throw new Error("not implemented");
  }
  async getDiseaseDistribution() {
    throw new Error("not implemented");
  }
  async getUserTrend() {
    throw new Error("not implemented");
  }
  async getPerformanceMetrics() {
    throw new Error("not implemented");
  }
  async getDiseaseAccuracy() {
    throw new Error("not implemented");
  }
  async getSystemStatus() {
    throw new Error("not implemented");
  }
  async getModelInfo() {
    throw new Error("not implemented");
  }
}

module.exports = AdminRepository;
