require("dotenv").config();
const express = require("express");
const cors = require("cors");
const pool = require("./infrastructure/db/pool");
const DiagnosisRepositoryImpl = require("./infrastructure/db/DiagnosisRepositoryImpl");
const { authenticate, requireAdmin } = require("./infrastructure/middleware/auth");
const DiagnosisService = require("./application/DiagnosisService");
const InternalMonitoringService = require("./application/InternalMonitoringService");
const InternalAdminService = require("./application/InternalAdminService");
const DiagnosisController = require("./interfaces/DiagnosisController");
const InternalMonitoringController = require("./interfaces/InternalMonitoringController");
const InternalAdminController = require("./interfaces/InternalAdminController");
const createDiagnosisRoutes = require("./interfaces/routes/diagnosisRoutes");
const createInternalMonitoringRoutes = require("./interfaces/routes/internalMonitoringRoutes");
const createInternalAdminRoutes = require("./interfaces/routes/internalAdminRoutes");

const storageService = require("./infrastructure/storage/StorageService");
const diagnosisRepository = new DiagnosisRepositoryImpl(pool);
const diagnosisService = new DiagnosisService(diagnosisRepository);
const diagnosisController = new DiagnosisController(diagnosisService, storageService);
const internalMonitoringService = new InternalMonitoringService(pool);
const internalMonitoringController = new InternalMonitoringController(internalMonitoringService);
const internalAdminService = new InternalAdminService(pool, storageService);
const internalAdminController = new InternalAdminController(internalAdminService);

const app = express();
const port = process.env.PORT || 3004;
app.use(cors());
app.use(express.json());
if (process.env.NODE_ENV !== "production") {
  app.use("/uploads", express.static(require("path").join(__dirname, "uploads")));
}

app.get("/health", (req, res) => {
  res.json({
    status: "UP",
    service: "diagnosis-service",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/v1/diagnoses", createDiagnosisRoutes(diagnosisController, authenticate, requireAdmin));
app.use("/internal/monitoring", createInternalMonitoringRoutes(internalMonitoringController));
app.use("/internal/admin", createInternalAdminRoutes(internalAdminController));

app.use((err, req, res, next) => {
  console.error(`[diagnosis-service] ${req.method} ${req.originalUrl}`, err.message);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.statusCode ? err.message : "Internal Server Error",
  });
});

app.use((req, res) => {
  res.status(404).json({ success: false, message: "Not Found" });
});

app.listen(port, () => console.log(`[diagnosis-service] running on port ${port}`));
module.exports = app;
