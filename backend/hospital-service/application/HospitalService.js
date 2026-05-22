/**
 * ═══════════════════════════════════════════════
 * Hospital Application Service (응용 계층)
 * ═══════════════════════════════════════════════
 *
 * 기능:
 *   - 병원 탐색 (네이버 지도 API)
 *   - 병원 상세 조회
 */
const { Hospital, DomainError } = require("../domain/entities/Hospital");

class HospitalService {
  constructor(hospitalRepository, naverMapClient = null) {
    this.hospitalRepository = hospitalRepository;
    this.naverMapClient = naverMapClient;
  }

  // ── 주변 병원 탐색 (lat, lng, sort, page, size) ──
  async searchHospitals({
    latitude,
    longitude,
    sort = "distance",
    page = 1,
    size = 3,
    radius = 5000,
    keyword,
    address,
  }) {
    Hospital.validateCoordinates(latitude, longitude);

    await this.syncHospitalsFromNaver({
      latitude,
      longitude,
      address,
      keyword,
    });

    // - Redis 캐싱으로 자주 검색되는 지역 결과 캐싱 (비용 절감)
    // - 요청 횟수 제한 (Rate Limiting)
    //네이버 api 요청을 해서 주소정보를 받아오는 것
    //주소 데이터를 사용을 해서 네이버 검색 api 요청을 해서 병원 정보를 응답으로 받아오는 것
    //병원 정보를 가공을 해서 db에 저장함
    //db정보를 프론트에 전달하는 것
    const all = await this.hospitalRepository.findNearby(
      latitude,
      longitude,
      radius,
      keyword,
    );

    // 정렬: distance(기본) | rating
    const sorted = [...all].sort((a, b) => {
      if (sort === "rating") {
        return (b.rating || 0) - (a.rating || 0);
      }
      return (a.distance || 0) - (b.distance || 0);
    });

    // 페이지네이션
    const total = sorted.length;
    const offset = (page - 1) * size;
    const hospitals = sorted.slice(offset, offset + size);

    return {
      hospitals: hospitals.map((hospital) => this.toListItem(hospital)),
      pagination: { page, size, total, totalPages: Math.ceil(total / size) },
    };
  }

  async syncHospitalsFromNaver({ latitude, longitude, address, keyword }) {
    if (!this.naverMapClient?.searchEnabled) {
      return;
    }

    try {
      const searchAddress =
        address || (await this.reverseGeocode({ latitude, longitude })).address;
      if (!searchAddress || searchAddress === "현재 위치") {
        return;
      }

      const hospitals = await this.naverMapClient.searchLocalHospitals({
        address: searchAddress,
        keyword: keyword || process.env.NAVER_HOSPITAL_SEARCH_KEYWORD || "피부과",
        display: Number(process.env.NAVER_HOSPITAL_SEARCH_DISPLAY || 5),
      });

      if (hospitals.length) {
        await this.hospitalRepository.upsertMany(
          hospitals.map((hospital) => new Hospital(hospital)),
        );
      }
    } catch (error) {
      console.warn(
        "[hospital-service] Naver hospital sync skipped:",
        error.message,
      );
    }
  }

  async reverseGeocode({ latitude, longitude }) {
    Hospital.validateCoordinates(latitude, longitude);

    const location = await this.naverMapClient?.reverseGeocode(
      latitude,
      longitude,
    );

    return (
      location || {
        address: "현재 위치",
        region1: "",
        region2: "",
        region3: "",
        source: "fallback",
      }
    );
  }

  // ── 병원 상세 조회 ───────────────────────
  async getHospitalById(hospitalId) {
    const hospital = await this.hospitalRepository.findById(hospitalId);
    if (!hospital) throw new DomainError("병원 정보를 찾을 수 없습니다.", 404);
    return this.toListItem(hospital);
  }

  toListItem(hospital) {
    const latitude = Number(hospital.latitude);
    const longitude = Number(hospital.longitude);
    const distanceMeters = Number(hospital.distance || 0);

    return {
      id: hospital.hospital_id,
      name: hospital.name,
      address: hospital.address,
      phone: hospital.phone,
      hours: this.formatOpenHours(hospital.open_hours),
      rating:
        hospital.rating === undefined || hospital.rating === null
          ? null
          : Number(hospital.rating),
      distanceKm: Number((distanceMeters / 1000).toFixed(1)),
      isOpen: true,
      latitude,
      longitude,
      mapUrl: this.createNaverMapUrl(hospital),
    };
  }

  formatOpenHours(openHours) {
    if (!openHours) return "영업시간 정보 없음";
    if (typeof openHours === "string") {
      try {
        const parsed = JSON.parse(openHours);
        return parsed?.label || parsed?.weekday || "영업시간 정보 없음";
      } catch {
        return openHours;
      }
    }
    return openHours.label || openHours.weekday || "영업시간 정보 없음";
  }

  createNaverMapUrl(hospital) {
    return `https://map.naver.com/p/search/${encodeURIComponent(
      hospital.name,
    )}`;
  }
}

module.exports = HospitalService;
