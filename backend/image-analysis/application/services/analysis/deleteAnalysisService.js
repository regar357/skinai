const { analysisRepository } = require("../../../infrastructure/repositories/mysqlAnalysisRepository");

async function deleteAnalysis({ analysisIds, userId }) {
  const uniqueAnalysisIds = [...new Set(analysisIds.map((id) => Number(id)).filter(Number.isInteger))];

  if (uniqueAnalysisIds.length === 0) {
    const error = new Error("At least one valid analysis id is required.");
    error.statusCode = 400;
    throw error;
  }

  const deletedCount = await analysisRepository.deleteManyByIds({
    analysisIds: uniqueAnalysisIds,
    userId,
  });

  return {
    deletedIds: uniqueAnalysisIds,
    deletedCount,
  };
}

module.exports = {
  deleteAnalysis,
};
