/**
 * ═══════════════════════════════════════════════
 * Admin Application Service (응용 계층)
 * ═══════════════════════════════════════════════
 *
 * 관리자 화면이 필요로 하는 기능:
 *   - 사용자 관리 (조회/정지/해제/삭제)
 *   - 피드백 관리 (목록/답변)
 *   - 분석/이미지 관리 (검사기록/이미지 정보)
 *   - 질환(피부백과) 관리 (CRUD)
 *   - 공지사항 관리 (CRUD)
 *   - 대시보드/AI 모니터링 통계 집계
 */
class AdminService {
  constructor({ serviceClient, adminRepository }) {
    this.serviceClient = serviceClient;
    this.adminRepository = adminRepository;
  }

  // ─────────────────────────────────────────────
  // 사용자 관리
  // ─────────────────────────────────────────────
  async getUsers({ page, limit, status, token }) {
    return await this.adminRepository.findUsers({ page, limit, status });
  }

  async suspendUser(userId, token) {
    return await this.adminRepository.updateUserStatus(userId, "suspended");
  }

  async unsuspendUser(userId, token) {
    return await this.adminRepository.updateUserStatus(userId, "active");
  }

  async deleteUser(userId, token) {
    return await this.adminRepository.updateUserStatus(userId, "deleted");
  }

  // ─────────────────────────────────────────────
  // 피드백 관리
  // ─────────────────────────────────────────────
  async getFeedbacks({ page, limit, token }) {
    return await this.adminRepository.findFeedbacks({ page, limit });
  }

  async replyFeedback(feedbackId, replyText, token) {
    if (!replyText) {
      const err = new Error("답변 내용이 필요합니다.");
      err.statusCode = 400;
      throw err;
    }
    return await this.adminRepository.saveFeedbackReply(feedbackId, replyText);
  }

  // ─────────────────────────────────────────────
  // 분석/이미지 관리
  // ─────────────────────────────────────────────
  async getExamRecords({ page, limit, search, token }) {
    return await this.adminRepository.findExamRecords({ page, limit, search });
  }

  async getImageInfo(imageId, token) {
    const image = await this.adminRepository.findImageById(imageId);
    if (!image) {
      const err = new Error("이미지를 찾을 수 없습니다.");
      err.statusCode = 404;
      throw err;
    }
    return image;
  }

  // ─────────────────────────────────────────────
  // 질환(피부백과) 관리 - content-service 호출
  // ─────────────────────────────────────────────
  async getDiseaseDetail(diseaseId) {
    const result = await this.serviceClient.getEncyclopediaArticle(diseaseId);
    return result.data || result;
  }

  async createDisease(payload, token) {
    const result = await this.serviceClient.createEncyclopediaArticle(
      payload,
      token,
    );
    return result.data || result;
  }

  async updateDisease(diseaseId, payload, token) {
    const result = await this.serviceClient.updateEncyclopediaArticle(
      diseaseId,
      payload,
      token,
    );
    return result.data || result;
  }

  async deleteDisease(diseaseId, token) {
    return await this.serviceClient.deleteEncyclopediaArticle(diseaseId, token);
  }

  // ─────────────────────────────────────────────
  // 공지사항 관리 - content-service 호출
  // ─────────────────────────────────────────────
  async getNotices({ page, limit }) {
    const result = await this.serviceClient.getNotices(page, limit);
    return result;
  }

  async createNotice(payload, token) {
    const result = await this.serviceClient.createNotice(payload, token);
    return result.data || result;
  }

  async updateNotice(noticeId, payload, token) {
    const result = await this.serviceClient.updateNotice(
      noticeId,
      payload,
      token,
    );
    return result.data || result;
  }

  async deleteNotice(noticeId, token) {
    return await this.serviceClient.deleteNotice(noticeId, token);
  }

  // ─────────────────────────────────────────────
  // 대시보드 통계 — monitoring-service 위임
  // ─────────────────────────────────────────────
  async getDashboardStats() {
    return (await this.serviceClient.getMonitoringDashboardStats()) ||
      { totalUsers: 0, activeUsers: 0, totalAnalyses: 0, todayAnalyses: 0 };
  }

  async getDiagnosisTrend() {
    return (await this.serviceClient.getMonitoringDiagnosisTrend()) || [];
  }

  async getDiseaseDistribution() {
    return (await this.serviceClient.getMonitoringDiseaseDistribution()) || [];
  }

  async getUserTrend() {
    return (await this.serviceClient.getMonitoringUserTrend()) || [];
  }

  // ─────────────────────────────────────────────
  // AI 모니터링 — monitoring-service 위임
  // ─────────────────────────────────────────────
  async getPerformanceMetrics() {
    return (await this.serviceClient.getMonitoringPerformance()) || [];
  }

  async getDiseaseAccuracy() {
    return (await this.serviceClient.getMonitoringDiseaseAccuracy()) || [];
  }

  async getSystemStatus() {
    return (await this.serviceClient.getMonitoringSystemStatus()) ||
      { averageResponseTime: 0, dailyRequests: 0, errorRate: 0, uptime: 0 };
  }

  async getModelInfo() {
    return (await this.serviceClient.getMonitoringModelInfo()) || {};
  }
}

module.exports = AdminService;
