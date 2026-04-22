const express = require("express");

const analysisRoutes = require("./analysisRoutes");
const {
  createAnalysisHandler,
} = require("../controllers/analysisController");
const { verifyJwt } = require("../../infrastructure/middlewares/authMiddleware");
const { uploadImage } = require("../../infrastructure/middlewares/uploadMiddleware");

const router = express.Router();

router.post("/v1/analyze", verifyJwt, uploadImage.single("image"), createAnalysisHandler);
router.use("/v1/history", analysisRoutes);

module.exports = router;
