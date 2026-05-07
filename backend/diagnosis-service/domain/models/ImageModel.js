/**
 * ═══════════════════════════════════════════════
 * Image Data Model (도메인 계층 - 데이터 모델)
 * ═══════════════════════════════════════════════
 *
 * 역할: Image 데이터의 필드 정의 (DTO/순수 데이터)
 * - 비즈니스 규칙 없음 (검증/동작 메서드는 Image 엔티티에 위치)
 */
class ImageModel {
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
}

module.exports = ImageModel;
