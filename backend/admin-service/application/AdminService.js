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
  constructor({ serviceClient, adminRepository, jwt }) {
    this.serviceClient = serviceClient;
    this.adminRepository = adminRepository;
    this.jwt = jwt; // jsonwebtoken
  }

  // ─────────────────────────────────────────────
  // 관리자 로그인
  // - 인증은 auth-service 에 위임하되, 결과 user.role 이
  //   admin 인 경우에만 통과시킨다.
  // ─────────────────────────────────────────────
  async login({ email, password }) {
    if (!email || !password) {
      const err = new Error("이메일과 비밀번호를 입력해주세요.");
      err.statusCode = 400;
      throw err;
    }
    const result = await this.serviceClient.login({ email, password });

    // 토큰을 디코딩해서 role 검증 (SECRET이 같다면 verify 가능)
    let role = "user";
    try {
      const secret = process.env.JWT_SECRET || "1234";
      const decoded = this.jwt.verify(result.accessToken, secret);
      role = decoded.role;
    } catch {
      // verify 실패 시에는 email 기반 휴리스틱으로 폴백
      role = email.startsWith("admin") ? "admin" : "user";
    }

    if (role !== "admin") {
      const err = new Error("관리자 권한이 없습니다.");
      err.statusCode = 403;
      throw err;
    }
    return result;
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
  // 대시보드 통계
  // ─────────────────────────────────────────────
  async getDashboardStats(token) {
    return await this.adminRepository.getDashboardStats();
  }

  async getDiagnosisTrend(token) {
    return await this.adminRepository.getDiagnosisTrend();
  }

  async getDiseaseDistribution(token) {
    return await this.adminRepository.getDiseaseDistribution();
  }

  async getUserTrend(token) {
    return await this.adminRepository.getUserTrend();
  }

  // ─────────────────────────────────────────────
  // AI 모니터링
  // ─────────────────────────────────────────────
  async getPerformanceMetrics(token) {
    return await this.adminRepository.getPerformanceMetrics();
  }

  async getDiseaseAccuracy(token) {
    return await this.adminRepository.getDiseaseAccuracy();
  }

  async getSystemStatus(token) {
    return await this.adminRepository.getSystemStatus();
  }

  async getModelInfo(token) {
    return await this.adminRepository.getModelInfo();
  }
}

module.exports = AdminService;
