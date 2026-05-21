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
  router.get("/reverse-geocode", auth, ctrl.reverseGeocode); // 현재 위치 좌표 → 주소 표시
  router.get("/nearby", auth, ctrl.getNearby); // 주변 병원 탐색 (구 /search)
  router.get("/:id", auth, ctrl.getById); // 병원 상세 조회
  return router;
};
