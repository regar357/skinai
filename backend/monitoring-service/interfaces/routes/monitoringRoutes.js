const express = require("express");
const router = express.Router();

module.exports = (ctrl, auth, adminAuth) => {
  router.get("/ai-logs", auth, adminAuth, ctrl.getAiLogs);            // AI 진단 로그
  router.get("/ai-logs/:id", auth, adminAuth, ctrl.getAiLogsByDiagnosis); // 진단별 로그
  router.get("/dashboard", auth, adminAuth, ctrl.getDashboard);        // 대시보드
  router.get("/health-check", auth, adminAuth, ctrl.healthCheck);      // 전체 헬스체크
  return router;
};
