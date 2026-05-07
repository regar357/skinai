/**
 * ═══════════════════════════════════════════════
 * ShareLink Data Model (도메인 계층 - 데이터 모델)
 * ═══════════════════════════════════════════════
 *
 * 역할: ShareLink 데이터의 필드 정의 (DTO/순수 데이터)
 * - 비즈니스 규칙 없음 (검증/동작 메서드는 ShareLink 엔티티에 위치)
 */
class ShareLinkModel {
  constructor({ share_id, diagnosis_id, user_id, share_token, expires_at, is_active, created_at }) {
    this.share_id = share_id || null;
    this.diagnosis_id = diagnosis_id;
    this.user_id = user_id;
    this.share_token = share_token;
    this.expires_at = expires_at || null;
    this.is_active = is_active !== undefined ? is_active : true;
    this.created_at = created_at || null;
  }
}

module.exports = ShareLinkModel;
