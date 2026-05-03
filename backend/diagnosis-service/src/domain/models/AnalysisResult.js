const { domainError } = require("../shared/error");

class AnalysisResult {
  constructor({
    id,
    userId,
    imageId,
    status = "PROCESSING",
    suspectedDisease = null,
    probability = 0,
    rawResult = null,
    errorMessage = null,
    analyzedAt = null,
    createdAt = new Date(),
    deletedAt = null,
  }) {
    if (!userId) throw domainError("InvalidAnalysis", "userId is required.");
    if (!imageId) throw domainError("InvalidAnalysis", "imageId is required.");

    this.id = id;
    this.userId = Number(userId);
    this.imageId = Number(imageId);
    this.status = status;
    this.suspectedDisease = suspectedDisease;
    this.probability = probability;
    this.rawResult = rawResult;
    this.errorMessage = errorMessage;
    this.analyzedAt = analyzedAt;
    this.createdAt = createdAt;
    this.deletedAt = deletedAt;
  }

  complete({ suspectedDisease, probability, rawResult }) {
    this.status = "COMPLETED";
    this.suspectedDisease = suspectedDisease || "정상";
    this.probability = probability;
    this.rawResult = rawResult || null;
    this.errorMessage = null;
    this.analyzedAt = new Date();
  }

  fail(message) {
    this.status = "FAILED";
    this.errorMessage = message;
  }

  markDeleted() {
    this.status = "DELETED";
    this.deletedAt = new Date();
  }
}

function domainError(code, message, statusCode = 400) {
  const error = new Error(message);
  error.code = code;
  error.statusCode = statusCode;
  return error;
}

module.exports = { AnalysisResult };
