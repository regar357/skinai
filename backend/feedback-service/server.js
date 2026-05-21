require("dotenv").config();
const express = require("express");
const cors = require("cors");

// ── 인프라 계층 ─────────────────────────────
const pool = require("./infrastructure/db/pool");
const FeedbackRepositoryImpl = require("./infrastructure/db/FeedbackRepositoryImpl");
const { authenticate } = require("./infrastructure/middleware/auth");

// ── 응용 계층 ───────────────────────────────
const FeedbackService = require("./application/FeedbackService");
const InternalAdminService = require("./application/InternalAdminService");

// ── 인터페이스 계층 ─────────────────────────
const FeedbackController = require("./interfaces/FeedbackController");
const InternalAdminController = require("./interfaces/InternalAdminController");
const createFeedbackRoutes = require("./interfaces/routes/feedbackRoutes");
const createInternalAdminRoutes = require("./interfaces/routes/internalAdminRoutes");

// ── DB 마이그레이션 (diagnosis_id 제거) ──────
async function migrate() {
  const addColumnIfMissing = async (columnName, definition) => {
    const [rows] = await pool.execute(
      `
        SELECT COLUMN_NAME FROM information_schema.COLUMNS
        WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'feedbacks'
          AND COLUMN_NAME = ?
      `,
      [columnName],
    );
    if (rows.length === 0) {
      await pool.execute(`ALTER TABLE feedbacks ADD COLUMN ${definition}`);
    }
  };

  try {
    // FK 제거
    const [fkRows] = await pool.execute(`
      SELECT CONSTRAINT_NAME FROM information_schema.KEY_COLUMN_USAGE
      WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'feedbacks'
        AND COLUMN_NAME = 'diagnosis_id' AND REFERENCED_TABLE_NAME IS NOT NULL
    `);
    for (const row of fkRows) {
      await pool.execute(`ALTER TABLE feedbacks DROP FOREIGN KEY ${row.CONSTRAINT_NAME}`);
    }
  } catch (e) { /* no FK */ }
  try {
    await pool.execute("ALTER TABLE feedbacks DROP INDEX uq_feedback_diagnosis_user");
  } catch (e) { /* index not found */ }
  try {
    await pool.execute("ALTER TABLE feedbacks DROP COLUMN diagnosis_id");
  } catch (e) { /* column already removed */ }
  try {
    await pool.execute("DROP TABLE IF EXISTS diagnoses");
  } catch (e) { /* table not found */ }
  await addColumnIfMissing("reply_text", "reply_text TEXT DEFAULT NULL");
  await addColumnIfMissing("replied_at", "replied_at DATETIME DEFAULT NULL");
}
migrate().catch((e) => console.warn("[feedback-service] migration warn:", e.message));

// ── 의존성 조립 (Composition Root) ──────────
const feedbackRepository = new FeedbackRepositoryImpl(pool);
const feedbackService = new FeedbackService(feedbackRepository);
const feedbackController = new FeedbackController(feedbackService);
const internalAdminService = new InternalAdminService(pool);
const internalAdminController = new InternalAdminController(internalAdminService);

// ── Express 앱 설정 ─────────────────────────
const app = express();
const port = process.env.PORT || 3007;

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "UP", service: "feedback-service", timestamp: new Date().toISOString() });
});

app.use("/api/v1/feedback", createFeedbackRoutes(feedbackController, authenticate));
app.use("/internal/admin", createInternalAdminRoutes(internalAdminController));

app.use((err, req, res, next) => {
  console.error(`[feedback-service] ${req.method} ${req.originalUrl}`, err.message);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({ success: false, message: err.statusCode ? err.message : "서버 내부 오류가 발생했습니다." });
});

app.use((req, res) => {
  res.status(404).json({ success: false, message: `Not Found: ${req.method} ${req.originalUrl}` });
});

app.listen(port, () => console.log(`[feedback-service] running on port ${port}`));
module.exports = app;
