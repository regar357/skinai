const { domainError } = require("../domain/shared/error");

function createDiagnosisService({
  imageRepository,
  analysisRepository,
  imageStorage,
  aiClient,
}) {
  return {
    async analyze({ userId, file }) {
      assertUser(userId);
      assertImage(file);

      const storedImage = await imageStorage.buildStoredImage(file);
      const image = await imageRepository.save(
        new DiagnosisImage({
          userId,
          ...storedImage,
        }),
      );
      const analysis = await analysisRepository.save(
        new AnalysisResult({
          userId,
          imageId: image.id,
        }),
      );

      try {
        const aiResult = await aiClient.analyze({
          file,
          imageUrl: image.fileUrl,
        });
        analysis.complete({
          suspectedDisease: aiResult.suspectedDisease,
          probability: toPercent(aiResult.probability),
          rawResult: aiResult.raw || aiResult,
        });
        image.markAnalyzed();
        await analysisRepository.save(analysis);
        await imageRepository.save(image);
        return toDiagnosisResponse(analysis, image);
      } catch (error) {
        analysis.fail(error.message);
        await analysisRepository.save(analysis);
        throw domainError("AiDiagnosisFailed", "AI diagnosis failed.", 502);
      }
    },

    async history({ userId, page = 1, size = 10 }) {
      assertUser(userId);
      const pageResult = await analysisRepository.findHistory({
        userId,
        page: Number(page) || 1,
        size: Number(size) || 10,
      });

      return {
        body: {
          items: await Promise.all(
            pageResult.items.map(async (analysis) => {
              const image = await imageRepository.findById(analysis.imageId);
              return {
                id: analysis.id,
                date: formatDate(analysis.analyzedAt || analysis.createdAt),
                result: analysis.suspectedDisease,
                score: analysis.probability,
                thumbnail: image ? image.thumbnailUrl : null,
              };
            }),
          ),
          pagination: pageResult.pagination,
        },
      };
    },

    async detail({ userId, diagnosisId }) {
      assertUser(userId);
      const analysis = await analysisRepository.findById(diagnosisId);
      if (!analysis || analysis.status === "DELETED")
        throw domainError("AnalysisResultNotFound", "Resource not found.", 404);
      if (Number(analysis.userId) !== Number(userId))
        throw domainError(
          "ForbiddenDiagnosisAccess",
          "Cannot access another user's diagnosis resource.",
          403,
        );

      const image = await imageRepository.findById(analysis.imageId);
      if (!image || image.status === "DELETED")
        throw domainError("ImageNotFound", "Resource not found.", 404);
      return toDiagnosisResponse(analysis, image);
    },

    async remove({ userId, diagnosisId }) {
      assertUser(userId);
      const analysis = await analysisRepository.findById(diagnosisId);
      if (!analysis || analysis.status === "DELETED")
        throw domainError("AnalysisResultNotFound", "Resource not found.", 404);
      if (Number(analysis.userId) !== Number(userId))
        throw domainError(
          "ForbiddenDiagnosisAccess",
          "Cannot access another user's diagnosis resource.",
          403,
        );
      analysis.markDeleted();
      await analysisRepository.save(analysis);
    },
  };
}

function assertUser(userId) {
  if (!userId) {
    throw domainError(
      "AuthenticatedUserRequired",
      "x-user-id header is required after API Gateway authentication.",
      400,
    );
  }
}

function assertImage(file) {
  if (!file)
    throw domainError("ImageRequired", "image field is required.", 400);
  if (!ALLOWED_IMAGE_TYPES.has(file.mimetype)) {
    throw domainError(
      "UnsupportedImageType",
      "Only jpeg, png, and webp images are supported.",
      400,
    );
  }
}

function toDiagnosisResponse(analysis, image) {
  return {
    body: {
      diagnosisId: analysis.id,
      imageUrl: image.fileUrl,
      result: {
        suspectedDisease: analysis.suspectedDisease,
        probability: analysis.probability,
      },
    },
  };
}

function toPercent(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return 0;
  if (number <= 1) return Math.round(number * 100);
  return Math.max(0, Math.min(100, Math.round(number)));
}

function formatDate(value) {
  const date = new Date(value);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}.${month}.${day}`;
}

module.exports = { createDiagnosisService, toPercent, formatDate };
