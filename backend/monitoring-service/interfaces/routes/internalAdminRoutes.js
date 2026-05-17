const express = require("express");
const router = express.Router();

const internalAuth = (req, res, next) => {
  const expected = process.env.INTERNAL_SERVICE_TOKEN || "internal-dev-token";
  if (req.headers["x-internal-token"] !== expected) {
    return res.status(403).json({ success: false, message: "Forbidden" });
  }
  next();
};

module.exports = (ctrl) => {
  // 대시보드
  router.get("/dashboard/stats", internalAuth, ctrl.getDashboardStats);
  router.get("/dashboard/diagnosis-trend", internalAuth, ctrl.getDiagnosisTrend);
  router.get("/dashboard/disease-distribution", internalAuth, ctrl.getDiseaseDistribution);
  router.get("/dashboard/user-trend", internalAuth, ctrl.getUserTrend);

  // AI 모니터링
  router.get("/monitoring/performance", internalAuth, ctrl.getPerformanceMetrics);
  router.get("/monitoring/disease-accuracy", internalAuth, ctrl.getDiseaseAccuracy);
  router.get("/monitoring/system-status", internalAuth, ctrl.getSystemStatus);
  router.get("/monitoring/model-info", internalAuth, ctrl.getModelInfo);

  return router;
};
