const FeedbackModel = require("../models/FeedbackModel");
const DomainError = require("./DomainError");

class Feedback extends FeedbackModel {
  static validateRating(rating) {
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      throw new DomainError("평점은 1~5 사이의 정수여야 합니다.");
    }
  }

  static createNew({ user_id, rating, content }) {
    if (rating === undefined || rating === null) {
      throw new DomainError("평점은 필수 입력 항목입니다.");
    }
    Feedback.validateRating(rating);
    return new Feedback({ user_id, rating, content });
  }

  updateContent({ rating, content }) {
    if (rating !== undefined) {
      Feedback.validateRating(rating);
      this.rating = rating;
    }
    if (content !== undefined) {
      this.content = content;
    }
  }
}

module.exports = { Feedback, DomainError };
