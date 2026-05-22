class FeedbackModel {
  constructor({ feedback_id, user_id, rating, content, reply_text, replied_at, created_at, updated_at }) {
    this.feedback_id = feedback_id || null;
    this.user_id = user_id;
    this.rating = rating;
    this.content = content || null;
    this.reply_text = reply_text || null;
    this.replied_at = replied_at || null;
    this.created_at = created_at || null;
    this.updated_at = updated_at || null;
  }
}

module.exports = FeedbackModel;
