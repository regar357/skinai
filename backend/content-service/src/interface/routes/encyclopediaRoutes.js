const express = require("express");
const {
  listItems,
  createItem,
  updateItem,
  deleteItem,
} = require("../controllers/encyclopediaController");

const router = express.Router();

router.get("/", listItems);
router.post("/", createItem);
router.put("/:id", updateItem);
router.delete("/:id", deleteItem);

module.exports = router;
