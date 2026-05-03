const express = require("express");

function createDiagnosisRouter({ upload, controller }) {
  const router = express.Router();

  router.post("/diagnosis", upload, controller.analyze);
  router.get("/diagnosis/history", controller.history);
  router.get("/diagnosis/:id", controller.detail);
  router.delete("/diagnosis/:id", controller.remove);

  return router;
}

module.exports = { createDiagnosisRouter };
