class Hospital {
  constructor({ hospital_id, name, address, phone, latitude, longitude, rating, open_hours, specialties, created_at }) {
    this.hospital_id = hospital_id || null; this.name = name; this.address = address;
    this.phone = phone || null; this.latitude = latitude; this.longitude = longitude;
    this.rating = rating || null; this.open_hours = open_hours || null;
    this.specialties = specialties || null; this.created_at = created_at || null;
  }
  static validateCoordinates(lat, lng) {
    if (lat === undefined || lng === undefined) throw new DomainError("위치 정보(위도, 경도)는 필수입니다.");
  }
}
class DomainError extends Error { constructor(msg, code = 400) { super(msg); this.statusCode = code; } }
module.exports = { Hospital, DomainError };
