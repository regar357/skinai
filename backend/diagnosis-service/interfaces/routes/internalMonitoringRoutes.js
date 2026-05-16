const express = require("express");
const internalAuth = require("../../infrastructure/middleware/internalAuth");
const router = express.Router();

module.exports = (ctrl) => {
  router.get("/performance", internalAuth, ctrl.getPerformance);
  router.get("/disease-accuracy", internalAuth, ctrl.getDiseaseAccuracy);
  router.get("/daily-summary", internalAuth, ctrl.getDailySummary);
  return router;
};
