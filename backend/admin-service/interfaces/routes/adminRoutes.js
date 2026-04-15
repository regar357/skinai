const express = require("express");
const adminController = require("../controllers/adminController");

const router = express.Router();
router.post("/login", adminController.adminLogin);
router.post("/logout", adminController.adminLogout);

module.exports = router;
