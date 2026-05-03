/**
 * ═══════════════════════════════════════════════
 * Hospital Application Service (응용 계층)
 * ═══════════════════════════════════════════════
 * 
 * 기능:
 *   - 병원 탐색 (네이버 지도 API)
 *   - 병원 상세 조회
 */
const { Hospital, DomainError } = require("../domain/Hospital");

class HospitalService {
  constructor(hospitalRepository) {
    this.hospitalRepository = hospitalRepository;
  }

  // ── 주변 병원 탐색 ───────────────────────
  async searchHospitals({ latitude, longitude, radius = 5000, keyword }) {
    Hospital.validateCoordinates(latitude, longitude);

    // TODO: 네이버 지도 API 연동
    // - Redis 캐싱으로 자주 검색되는 지역 결과 캐싱 (비용 절감)
    // - 요청 횟수 제한 (Rate Limiting)
    const hospitals = await this.hospitalRepository.findNearby(latitude, longitude, radius, keyword);
    return hospitals;
  }

  // ── 병원 상세 조회 ───────────────────────
  async getHospitalById(hospitalId) {
    const hospital = await this.hospitalRepository.findById(hospitalId);
    if (!hospital) throw new DomainError("병원 정보를 찾을 수 없습니다.", 404);
    return hospital;
  }
}

module.exports = HospitalService;
