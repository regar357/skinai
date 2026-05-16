/**
 * ═══════════════════════════════════════════════
 * Content Routes (인터페이스 계층)
 * ═══════════════════════════════════════════════
 *
 * 프론트엔드 양식 정합을 위해 공지사항/피부백과를 별개의
 * 최상위 prefix 로 노출 (구 /content/notices → /notices,
 * 구 /content/encyclopedia → /encyclopedia).
 *
 * 노출 엔드포인트:
 *   /api/v1/notices       - 공지사항 (GET 공개, 쓰기 관리자)
 *   /api/v1/encyclopedia  - 피부백과 (GET 공개, 쓰기 관리자)
 */
const express = require("express");

function createNoticeRoutes(ctrl, auth, adminAuth) {
  const router = express.Router();
  router.get("/", ctrl.getNotices);
  router.get("/:id", ctrl.getNoticeById);
  router.post("/", auth, adminAuth, ctrl.createNotice);
  router.put("/:id", auth, adminAuth, ctrl.updateNotice);
  router.delete("/:id", auth, adminAuth, ctrl.deleteNotice);
  return router;
}

function createEncyclopediaRoutes(ctrl, auth, adminAuth) {
  const router = express.Router();
  router.get("/", ctrl.getArticles);
  router.get("/:id", ctrl.getArticleById);
  router.post("/", auth, adminAuth, ctrl.createArticle);
  router.put("/:id", auth, adminAuth, ctrl.updateArticle);
  router.delete("/:id", auth, adminAuth, ctrl.deleteArticle);
  return router;
}

// 호환용: 기존 /api/v1/content 하위 통합 라우터
function createContentRoutes(ctrl, auth, adminAuth) {
  const router = express.Router();
  router.use("/notices", createNoticeRoutes(ctrl, auth, adminAuth));
  router.use("/encyclopedia", createEncyclopediaRoutes(ctrl, auth, adminAuth));
  return router;
}

module.exports = createContentRoutes;
module.exports.createNoticeRoutes = createNoticeRoutes;
module.exports.createEncyclopediaRoutes = createEncyclopediaRoutes;
