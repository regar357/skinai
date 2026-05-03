/**
 * Feedback Repository Interface (도메인 계층)
 */
class FeedbackRepository {
  async findById(feedbackId, userId) {
    throw new Error("findById()를 구현해야 합니다.");
  }

  async findByUserId(userId, page, limit) {
    throw new Error("findByUserId()를 구현해야 합니다.");
  }

  async findByDiagnosisAndUser(diagnosisId, userId) {
    throw new Error("findByDiagnosisAndUser()를 구현해야 합니다.");
  }

  async countByUserId(userId) {
    throw new Error("countByUserId()를 구현해야 합니다.");
  }

  async save(feedback) {
    throw new Error("save()를 구현해야 합니다.");
  }

  async update(feedbackId, userId, fields) {
    throw new Error("update()를 구현해야 합니다.");
  }

  async delete(feedbackId, userId) {
    throw new Error("delete()를 구현해야 합니다.");
  }

  async existsByDiagnosisAndUser(diagnosisId, userId) {
    throw new Error("existsByDiagnosisAndUser()를 구현해야 합니다.");
  }
}

module.exports = FeedbackRepository;
