const { mapAnalysisListItemResponse } = require("../../../domain/entities/analysis");
const { analysisRepository } = require("../../../infrastructure/repositories/mysqlAnalysisRepository");

async function getAnalysisList({ userId, page, limit, sortBy, order }) {
  const result = await analysisRepository.findAllForUser({
    userId,
    page,
    limit,
    sortBy,
    order,
  });

  return {
    items: result.items.map(mapAnalysisListItemResponse),
    pagination: result.pagination,
  };
}

module.exports = {
  getAnalysisList,
};
