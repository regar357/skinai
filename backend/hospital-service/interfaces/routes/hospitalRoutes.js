/**
 * ═══════════════════════════════════════════════
 * Hospital Routes (인터페이스 계층)
 * ═══════════════════════════════════════════════
 *
 * 엔드포인트:
 *   GET /api/v1/hospitals/nearby - 주변 병원 탐색 (lat, lng, sort, page, size)
 *   GET /api/v1/hospitals/:id    - 병원 상세 조회
 */
const express = require("express");
const router = express.Router();

module.exports = (ctrl, auth) => {
  router.get("/reverse-geocode", ctrl.reverseGeocode); // 공개: 좌표 → 주소 변환
  router.get("/nearby", ctrl.getNearby);               // 공개: 주변 병원 탐색
  router.get("/:id", auth, ctrl.getById);              // 인증 필요: 병원 상세 조회
  return router;
};
