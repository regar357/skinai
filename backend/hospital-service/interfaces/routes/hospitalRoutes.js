const express = require("express");
const router = express.Router();

module.exports = (ctrl, auth) => {
  router.get("/search", auth, ctrl.search);     // 병원 탐색
  router.get("/:id", auth, ctrl.getById);        // 병원 상세 조회
  return router;
};
