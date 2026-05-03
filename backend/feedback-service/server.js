require("dotenv").config();
const express = require("express");
const cors = require("cors");

// ── 인프라 계층 ─────────────────────────────
const pool = require("./infrastructure/db/pool");
const FeedbackRepositoryImpl = require("./infrastructure/db/FeedbackRepositoryImpl");
const DiagnosisClient = require("./infrastructure/DiagnosisClient");
const { authenticate } = require("./infrastructure/middleware/auth");

// ── 응용 계층 ───────────────────────────────
const FeedbackService = require("./application/FeedbackService");

// ── 인터페이스 계층 ─────────────────────────
const FeedbackController = require("./interfaces/FeedbackController");
const createFeedbackRoutes = require("./interfaces/routes/feedbackRoutes");

// ── 의존성 조립 (Composition Root) ──────────
const feedbackRepository = new FeedbackRepositoryImpl(pool);
const diagnosisClient = new DiagnosisClient();
const feedbackService = new FeedbackService(feedbackRepository, diagnosisClient);
const feedbackController = new FeedbackController(feedbackService);

// ── Express 앱 설정 ─────────────────────────
const app = express();
const port = process.env.PORT || 3007;

app.use(cors());
app.use(express.json());

// 헬스체크
app.get("/health", (req, res) => {
  res.json({ status: "UP", service: "feedback-service", timestamp: new Date().toISOString() });
});

// 라우트 등록
app.use("/api/feedbacks", createFeedbackRoutes(feedbackController, authenticate));

// 전역 에러 핸들링
app.use((err, req, res, next) => {
  console.error(`[feedback-service] ${req.method} ${req.originalUrl}`, err.message);
  const statusCode = err.statusCode || 500;
  const message = err.statusCode ? err.message : "서버 내부 오류가 발생했습니다.";
  res.status(statusCode).json({ success: false, message });
});

// 404
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Not Found: ${req.method} ${req.originalUrl}` });
});

app.listen(port, () => {
  console.log(`[feedback-service] running on port ${port}`);
});

module.exports = app;
