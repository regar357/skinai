const { mapAnalysisCreateResponse } = require("../../../domain/entities/analysis");
const { analysisRepository } = require("../../../infrastructure/repositories/mysqlAnalysisRepository");
const { requestAnalysis } = require("../../../infrastructure/clients/aiServerClient");

function deriveResultPayload(aiResult) {
  return {
    overallScore: aiResult?.overallScore ?? 0,
    status: aiResult?.status ?? "warn",
    summary: aiResult?.summary ?? "AI analysis result is unavailable.",
    details: {
      moisture: aiResult?.details?.moisture ?? 0,
      uv: aiResult?.details?.uv ?? 0,
      barrier: aiResult?.details?.barrier ?? 0,
      sebum: aiResult?.details?.sebum ?? 0,
    },
    recommendations: Array.isArray(aiResult?.recommendations) ? aiResult.recommendations : [],
  };
}

async function createAnalysis({ file, userId, gender, age }) {
  const aiResult = await requestAnalysis({
    file,
    gender,
    age,
  });

  const resultPayload = deriveResultPayload(aiResult);

  const createdAnalysis = await analysisRepository.create({
    userId,
    imageUrl: `/uploads/${file.filename}`,
    thumbnailUrl: `/uploads/${file.filename}`,
    gender,
    age,
    overallScore: resultPayload.overallScore,
    status: resultPayload.status,
    summary: resultPayload.summary,
    details: resultPayload.details,
    recommendations: resultPayload.recommendations,
  });

  return mapAnalysisCreateResponse(createdAnalysis);
}

module.exports = {
  createAnalysis,
};
