/**
 * ═══════════════════════════════════════════════
 * Content Service - 진입점 (Composition Root)
 * ═══════════════════════════════════════════════
 * 
 * 포트: 3005
 * 통합: 피부백과 CRUD + 공지사항 CRUD
 */
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const pool = require("./infrastructure/db/pool");
const ContentRepositoryImpl = require("./infrastructure/db/ContentRepositoryImpl");
const { authenticate, requireAdmin } = require("./infrastructure/middleware/auth");
const ContentService = require("./application/ContentService");
const ContentController = require("./interfaces/ContentController");
const createContentRoutes = require("./interfaces/routes/contentRoutes");

// 의존성 조립
const contentRepository = new ContentRepositoryImpl(pool);
const contentService = new ContentService(contentRepository);
const contentController = new ContentController(contentService);

const app = express();
const port = process.env.PORT || 3005;
app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => res.json({ status: "UP", service: "content-service" }));
app.use("/api/content", createContentRoutes(contentController, authenticate, requireAdmin));

app.use((err, req, res, next) => {
  console.error(`[content-service] ${req.method} ${req.originalUrl}`, err.message);
  res.status(err.statusCode || 500).json({ success: false, message: err.statusCode ? err.message : "서버 내부 오류" });
});
app.use((req, res) => res.status(404).json({ success: false, message: "Not Found" }));

app.listen(port, () => console.log(`[content-service] running on port ${port}`));
module.exports = app;
