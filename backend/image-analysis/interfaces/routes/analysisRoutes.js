const express = require("express");

const {
  deleteAnalysisHandler,
  getAnalysisDetailHandler,
  getAnalysisListHandler,
} = require("../controllers/analysisController");
const { verifyJwt } = require("../../infrastructure/middlewares/authMiddleware");

const router = express.Router();

router.use(verifyJwt);

router.get("/", getAnalysisListHandler);
router.delete("/batch-delete", deleteAnalysisHandler);
router.get("/:id", getAnalysisDetailHandler);

module.exports = router;
