/**
 * ═══════════════════════════════════════════════
 * Notice Data Model (도메인 계층 - 데이터 모델)
 * ═══════════════════════════════════════════════
 *
 * 역할: Notice 데이터의 필드 정의 (DTO/순수 데이터)
 * - 비즈니스 규칙 없음 (검증/동작 메서드는 Notice 엔티티에 위치)
 */
class NoticeModel {
  constructor({ notice_id, admin_id, title, content, is_pinned, created_at, updated_at }) {
    this.notice_id = notice_id || null;
    this.admin_id = admin_id;
    this.title = title;
    this.content = content;
    this.is_pinned = is_pinned || false;
    this.created_at = created_at || null;
    this.updated_at = updated_at || null;
  }
}

module.exports = NoticeModel;
