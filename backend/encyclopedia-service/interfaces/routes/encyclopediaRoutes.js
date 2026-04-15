const express = require("express");
const encyclopediaController = require("../controllers/encyclopediaController");
const { requireAuth } = require("../middleware/authMiddleware");

const diseasesRouter = express.Router();
diseasesRouter.get("/", encyclopediaController.getDiseases);
diseasesRouter.get("/:disease_id", encyclopediaController.getDiseaseById);

const adminDiseasesRouter = express.Router();
adminDiseasesRouter.post(
  "/",
  requireAuth,
  encyclopediaController.createDisease,
);
adminDiseasesRouter.put(
  "/:disease_id",
  requireAuth,
  encyclopediaController.updateDisease,
);

module.exports = {
  diseasesRouter,
  adminDiseasesRouter,
};
