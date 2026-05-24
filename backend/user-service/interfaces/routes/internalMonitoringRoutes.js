const express = require("express");
const router = express.Router();

const internalAuth = (req, res, next) => {
  const expected = process.env.INTERNAL_SERVICE_TOKEN || "internal-dev-token";
  if (req.headers["x-internal-token"] !== expected) {
    return res.status(403).json({ success: false, message: "Forbidden" });
  }
  next();
};

module.exports = (ctrl) => {
  router.get("/dashboard/user-stats", internalAuth, ctrl.getUserDashboardStats);
  return router;
};
