/**
 * ═══════════════════════════════════════════════
 * Hospital Controller (인터페이스 계층)
 * ═══════════════════════════════════════════════
 *
 * API 목록:
 *   GET /api/v1/hospitals/nearby - 주변 병원 탐색 (lat, lng, sort, page, size)
 *   GET /api/v1/hospitals/:id    - 병원 상세 조회
 */
class HospitalController {
  constructor(hospitalService) { this.hospitalService = hospitalService; }

  // ── 주변 병원 탐색 (구 search → nearby) ──
  getNearby = async (req, res, next) => {
    try {
      const { lat, lng, sort, page, size, radius, keyword } = req.query;
      const result = await this.hospitalService.searchHospitals({
        latitude: parseFloat(lat),
        longitude: parseFloat(lng),
        sort: sort === "rating" ? "rating" : "distance",
        page: parseInt(page) || 1,
        size: parseInt(size) || 3,
        radius: parseInt(radius) || 5000,
        keyword,
      });
      res.status(200).json({
        success: true,
        data: result.hospitals || result,
        pagination: result.pagination || {},
      });
    } catch (e) { next(e); }
  };

  getById = async (req, res, next) => {
    try {
      const hospital = await this.hospitalService.getHospitalById(req.params.id);
      res.status(200).json({ success: true, data: hospital });
    } catch (e) { next(e); }
  };
}

module.exports = HospitalController;
