class FeedbackRepository {
  async findById(feedbackId, userId) { throw new Error("findById() 미구현"); }
  async findByUserId(userId, page, limit) { throw new Error("findByUserId() 미구현"); }
  async countByUserId(userId) { throw new Error("countByUserId() 미구현"); }
  async save(feedback) { throw new Error("save() 미구현"); }
  async update(feedbackId, userId, fields) { throw new Error("update() 미구현"); }
  async delete(feedbackId, userId) { throw new Error("delete() 미구현"); }
}

module.exports = FeedbackRepository;
