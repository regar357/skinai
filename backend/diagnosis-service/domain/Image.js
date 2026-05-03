/**
 * ═══════════════════════════════════════════════
 * Image Entity (도메인 계층)
 * ═══════════════════════════════════════════════
 * 
 * 분석 서비스 - 이미지 관련 비즈니스 규칙
 */
class ImageEntity {
  constructor({ image_id, user_id, diagnosis_id, original_url, processed_url, file_size, mime_type, created_at }) {
    this.image_id = image_id || null;
    this.user_id = user_id;
    this.diagnosis_id = diagnosis_id || null;
    this.original_url = original_url;
    this.processed_url = processed_url || null;
    this.file_size = file_size || 0;
    this.mime_type = mime_type || "image/jpeg";
    this.created_at = created_at || null;
  }

  static validateMimeType(type) {
    if (!["image/jpeg", "image/png", "image/webp"].includes(type)) {
      throw new DomainError("지원하지 않는 이미지 형식입니다.");
    }
  }
}

class DomainError extends Error {
  constructor(msg, code = 400) { super(msg); this.statusCode = code; }
}

module.exports = { ImageEntity, DomainError };
