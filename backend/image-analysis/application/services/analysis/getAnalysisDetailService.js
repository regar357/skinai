const { mapAnalysisDetailResponse } = require("../../../domain/entities/analysis");
const { analysisRepository } = require("../../../infrastructure/repositories/mysqlAnalysisRepository");

async function getAnalysisDetail({ analysisId, userId }) {
  const analysis = await analysisRepository.findByIdForUser({
    analysisId,
    userId,
  });

  if (!analysis) {
    const error = new Error("Analysis result not found.");
    error.statusCode = 404;
    throw error;
  }

  return mapAnalysisDetailResponse(analysis);
}

module.exports = {
  getAnalysisDetail,
};
