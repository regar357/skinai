/**
 * ═══════════════════════════════════════════════
 * Analysis Service - 진입점 (Composition Root)
 * ═══════════════════════════════════════════════
 * 
 * 포트: 3004
 * 통합: 이미지 업로드/S3, 분석 수행, 분석 결과 CRUD,
 *       분석 결과 공유, 분석 결과 로그
 */
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const pool = require("./infrastructure/db/pool");
const DiagnosisRepositoryImpl = require("./infrastructure/db/DiagnosisRepositoryImpl");
const { authenticate, requireAdmin } = require("./infrastructure/middleware/auth");
const DiagnosisService = require("./application/DiagnosisService");
const DiagnosisController = require("./interfaces/DiagnosisController");
const createDiagnosisRoutes = require("./interfaces/routes/diagnosisRoutes");

// 의존성 조립
const diagnosisRepository = new DiagnosisRepositoryImpl(pool);
const diagnosisService = new DiagnosisService(diagnosisRepository);
const diagnosisController = new DiagnosisController(diagnosisService);

const app = express();
const port = process.env.PORT || 3004;
app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => res.json({ status: "UP", service: "diagnosis-service" }));
app.use("/api/diagnoses", createDiagnosisRoutes(diagnosisController, authenticate, requireAdmin));

app.use((err, req, res, next) => {
  console.error(`[diagnosis-service] ${req.method} ${req.originalUrl}`, err.message);
  res.status(err.statusCode || 500).json({ success: false, message: err.statusCode ? err.message : "서버 내부 오류" });
});
app.use((req, res) => res.status(404).json({ success: false, message: "Not Found" }));

app.listen(port, () => console.log(`[diagnosis-service] running on port ${port}`));
module.exports = app;
