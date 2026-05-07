const express = require("express");
const router = express.Router();

module.exports = (ctrl, auth, adminAuth) => {
  // 피부백과 - 조회는 인증 불필요
  router.get("/encyclopedia", ctrl.getArticles);
  router.get("/encyclopedia/:id", ctrl.getArticleById);
  router.post("/encyclopedia", auth, adminAuth, ctrl.createArticle);
  router.put("/encyclopedia/:id", auth, adminAuth, ctrl.updateArticle);
  router.delete("/encyclopedia/:id", auth, adminAuth, ctrl.deleteArticle);

  // 공지사항 - 조회는 인증 불필요
  router.get("/notices", ctrl.getNotices);
  router.get("/notices/:id", ctrl.getNoticeById);
  router.post("/notices", auth, adminAuth, ctrl.createNotice);
  router.put("/notices/:id", auth, adminAuth, ctrl.updateNotice);
  router.delete("/notices/:id", auth, adminAuth, ctrl.deleteNotice);

  return router;
};
