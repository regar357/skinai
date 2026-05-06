const express = require("express");
const {
  listNotices,
  createNotice,
  updateNotice,
  deleteNotice,
} = require("../controllers/noticeController");

const router = express.Router();

router.get("/", listNotices);
router.post("/", createNotice);
router.put("/:id", updateNotice);
router.delete("/:id", deleteNotice);

module.exports = router;
