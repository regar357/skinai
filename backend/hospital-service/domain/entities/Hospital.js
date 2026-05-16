/**
 * ═══════════════════════════════════════════════
 * Hospital Entity (도메인 계층 - 엔티티)
 * ═══════════════════════════════════════════════
 *
 * 역할: Hospital 관련 비즈니스 규칙 담당
 * 데이터 필드 정의는 HospitalModel에 위치 (이 클래스는 그것을 상속받음)
 */
const HospitalModel = require("../models/HospitalModel");
const DomainError = require("./DomainError");

class Hospital extends HospitalModel {
  static validateCoordinates(lat, lng) {
    if (lat === undefined || lng === undefined) throw new DomainError("위치 정보(위도, 경도)는 필수입니다.");
  }
}

module.exports = { Hospital, DomainError };
