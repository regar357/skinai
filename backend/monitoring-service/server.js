require("dotenv").config();
const express = require("express");
const cors = require("cors");
const pool = require("./infrastructure/db/pool");
const { authenticate, requireAdmin } = require("./infrastructure/middleware/auth");
const MonitoringClient = require("./infrastructure/clients/MonitoringClient");
const MonitoringRepositoryImpl = require("./infrastructure/db/MonitoringRepositoryImpl");
const MonitoringService = require("./application/MonitoringService");
const MonitoringController = require("./interfaces/MonitoringController");
const createMonitoringRoutes = require("./interfaces/routes/monitoringRoutes");

const repository = new MonitoringRepositoryImpl(pool);
const client = new MonitoringClient();
const service = new MonitoringService({ client, repository });
const controller = new MonitoringController(service);

const app = express();
const port = process.env.PORT || 3009;
app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({
    status: "UP",
    service: "monitoring-service",
    timestamp: new Date().toISOString(),
  });
});

app.use(
  "/api/v1/monitoring",
  createMonitoringRoutes(controller, authenticate, requireAdmin),
);

app.use((err, req, res, next) => {
  console.error(`[monitoring-service] ${req.method} ${req.originalUrl}`, err.message);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.statusCode ? err.message : "Internal Server Error",
  });
});

app.use((req, res) => {
  res.status(404).json({ success: false, message: "Not Found" });
});

app.listen(port, () => console.log(`[monitoring-service] running on port ${port}`));
module.exports = app;
