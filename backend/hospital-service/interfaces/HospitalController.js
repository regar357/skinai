/**
 * ═══════════════════════════════════════════════
 * Hospital Controller (인터페이스 계층)
 * ═══════════════════════════════════════════════
 * 
 * API 목록:
 *   GET /api/hospitals/search  - 병원 탐색
 *   GET /api/hospitals/:id     - 병원 상세 조회
 */
class HospitalController {
  constructor(hospitalService) { this.hospitalService = hospitalService; }

  search = async (req, res, next) => {
    try {
      const { latitude, longitude, radius, keyword } = req.query;
      const hospitals = await this.hospitalService.searchHospitals({
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        radius: parseInt(radius) || 5000,
        keyword,
      });
      res.status(200).json({ success: true, data: hospitals });
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
