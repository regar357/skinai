/**
 * ═══════════════════════════════════════════════
 * Hospital Data Model (도메인 계층 - 데이터 모델)
 * ═══════════════════════════════════════════════
 *
 * 역할: Hospital 데이터의 필드 정의 (DTO/순수 데이터)
 * - 비즈니스 규칙 없음 (검증/동작 메서드는 Hospital 엔티티에 위치)
 */
class HospitalModel {
  constructor({
    hospital_id,
    name,
    address,
    phone,
    latitude,
    longitude,
    rating,
    open_hours,
    specialties,
    distance,
    created_at,
  }) {
    this.hospital_id = hospital_id || null;
    this.name = name;
    this.address = address;
    this.phone = phone || null;
    this.latitude = latitude;
    this.longitude = longitude;
    this.rating = rating || null;
    this.open_hours = open_hours || null;
    this.specialties = specialties || null;
    this.distance = distance ?? null;
    this.created_at = created_at || null;
  }
}

module.exports = HospitalModel;
