/**
 * ═══════════════════════════════════════════════
 * Image Entity (도메인 계층 - 엔티티)
 * ═══════════════════════════════════════════════
 *
 * 역할: Image 관련 비즈니스 규칙 담당
 * 데이터 필드 정의는 ImageModel에 위치 (이 클래스는 그것을 상속받음)
 */
const ImageModel = require("../models/ImageModel");
const DomainError = require("./DomainError");

class Image extends ImageModel {
  static validateMimeType(type) {
    if (!["image/jpeg", "image/png", "image/webp"].includes(type)) {
      throw new DomainError("지원하지 않는 이미지 형식입니다.");
    }
  }
}

module.exports = { Image, DomainError };
