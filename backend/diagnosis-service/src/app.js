const express = require("express");
const path = require("path");
const { createDiagnosisRouter } = require("./interface/router");
const { createDiagnosisController } = require("./interface/controller");
const { createDiagnosisService } = require("./application/diagnosisService");
const { createInMemoryStore } = require("./infrastructure/db/inMemoryStore");
const {
  InMemoryAnalysisRepository,
} = require("./infrastructure/db/InMemoryAnalysisRepository");
const {
  InMemoryImageRepository,
} = require("./infrastructure/db/InMemoryImageRepository");
const {
  createUploadMiddleware,
  uploadDir,
} = require("./infrastructure/middleware/uploadMiddleware");
const {
  LocalImageStorage,
} = require("./infrastructure/middleware/LocalImageStorage");
const { errorHandler } = require("./infrastructure/middleware/errorHandler");
const {
  FastApiDiagnosisClient,
} = require("./infrastructure/ai-client/FastApiDiagnosisClient");

function createApp({
  store = createInMemoryStore(),
  imageRepository = new InMemoryImageRepository(store),
  analysisRepository = new InMemoryAnalysisRepository(store),
  imageStorage = new LocalImageStorage(),
  aiClient = new FastApiDiagnosisClient(),
} = {}) {
  const app = express();
  const diagnosisService = createDiagnosisService({
    imageRepository,
    analysisRepository,
    imageStorage,
    aiClient,
  });
  const diagnosisController = createDiagnosisController({ diagnosisService });

  app.use(express.json());
  app.use("/uploads", express.static(path.resolve(uploadDir)));
  app.use(
    createDiagnosisRouter({
      upload: createUploadMiddleware(),
      controller: diagnosisController,
    }),
  );
  app.use(errorHandler);

  return { app, store, diagnosisService };
}

module.exports = { createApp };
