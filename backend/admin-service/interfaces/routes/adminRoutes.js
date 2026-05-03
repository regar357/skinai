const express = require("express");
const router = express.Router();

module.exports = (ctrl, auth, adminAuth) => {
  router.get("/overview", auth, adminAuth, ctrl.getOverview);
  return router;
};
