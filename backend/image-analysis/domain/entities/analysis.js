function parseRecommendations(value) {
  try {
    return typeof value === "string" ? JSON.parse(value) : value ?? [];
  } catch (error) {
    return [];
  }
}

function toIsoDateTime(value) {
  return value ? new Date(value).toISOString() : null;
}

function mapSharedAnalysisFields(record) {
  return {
    id: String(record.analysis_id),
    overallScore: Number(record.overall_score),
    status: record.status,
    summary: record.summary,
    details: {
      moisture: Number(record.detail_moisture),
      uv: Number(record.detail_uv),
      barrier: Number(record.detail_barrier),
      sebum: Number(record.detail_sebum),
    },
    recommendations: parseRecommendations(record.recommendations_json),
    createdAt: toIsoDateTime(record.created_at),
  };
}

function mapAnalysisCreateResponse(record) {
  return {
    id: String(record.analysis_id),
    imagePreview: record.image_url,
    overallScore: Number(record.overall_score),
    status: record.status,
    summary: record.summary,
    details: {
      moisture: Number(record.detail_moisture),
      uv: Number(record.detail_uv),
      barrier: Number(record.detail_barrier),
      sebum: Number(record.detail_sebum),
    },
    recommendations: parseRecommendations(record.recommendations_json),
    createdAt: toIsoDateTime(record.created_at),
  };
}

function mapAnalysisListItemResponse(record) {
  return {
    id: String(record.analysis_id),
    date: toIsoDateTime(record.created_at),
    result: record.summary,
    score: Number(record.overall_score),
    status: record.status,
    summary: record.summary,
    thumbnail: record.thumbnail_url ?? record.image_url,
    details: {
      moisture: Number(record.detail_moisture),
      uv: Number(record.detail_uv),
      barrier: Number(record.detail_barrier),
      sebum: Number(record.detail_sebum),
    },
  };
}

function mapAnalysisDetailResponse(record) {
  return {
    id: String(record.analysis_id),
    date: toIsoDateTime(record.created_at),
    imagePreview: record.image_url,
    ...mapSharedAnalysisFields(record),
  };
}

module.exports = {
  mapAnalysisCreateResponse,
  mapAnalysisDetailResponse,
  mapAnalysisListItemResponse,
};
