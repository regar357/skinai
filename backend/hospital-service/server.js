/**
 * ═══════════════════════════════════════════════
 * Hospital Service - 진입점 (Composition Root)
 * ═══════════════════════════════════════════════
 * 
 * 포트: 3006
 * 기능: 병원 탐색 (네이버 지도 API), 병원 상세 조회
 */
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const pool = require("./infrastructure/db/pool");
const HospitalRepositoryImpl = require("./infrastructure/db/HospitalRepositoryImpl");
const { authenticate } = require("./infrastructure/middleware/auth");
const HospitalService = require("./application/HospitalService");
const HospitalController = require("./interfaces/HospitalController");
const createHospitalRoutes = require("./interfaces/routes/hospitalRoutes");

// 의존성 조립
const hospitalRepository = new HospitalRepositoryImpl(pool);
const hospitalService = new HospitalService(hospitalRepository);
const hospitalController = new HospitalController(hospitalService);

const app = express();
const port = process.env.PORT || 3006;
app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => res.json({ status: "UP", service: "hospital-service" }));
app.use("/api/hospitals", createHospitalRoutes(hospitalController, authenticate));

app.use((err, req, res, next) => {
  console.error(`[hospital-service] ${req.method} ${req.originalUrl}`, err.message);
  res.status(err.statusCode || 500).json({ success: false, message: err.statusCode ? err.message : "서버 내부 오류" });
});
app.use((req, res) => res.status(404).json({ success: false, message: "Not Found" }));

app.listen(port, () => console.log(`[hospital-service] running on port ${port}`));
module.exports = app;
