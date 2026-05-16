const express = require("express");
const router = express.Router();

module.exports = (ctrl, auth, adminAuth) => {
  router.get("/performance", auth, adminAuth, ctrl.getPerformanceMetrics);
  router.get("/disease-accuracy", auth, adminAuth, ctrl.getDiseaseAccuracy);
  router.get("/system-status", auth, adminAuth, ctrl.getSystemStatus);
  router.get("/model-info", auth, adminAuth, ctrl.getModelInfo);
  return router;
};
