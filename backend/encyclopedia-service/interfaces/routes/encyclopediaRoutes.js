const express = require("express");

const encyclopediaController = require("../controllers/encyclopediaController");
const { requireAuth } = require("../../infrastructure/middlewares/authMiddleware");

const router = express.Router();

router.use(requireAuth);
router.get("/", encyclopediaController.getArticles);
router.get("/:id", encyclopediaController.getArticleById);

module.exports = router;
