/**
 * ═══════════════════════════════════════════════
 * Admin Data Model (도메인 계층 - 데이터 모델)
 * ═══════════════════════════════════════════════
 *
 * 역할: Admin 데이터의 필드 정의 (DTO/순수 데이터)
 * - 비즈니스 규칙 없음 (검증/동작 메서드는 Admin 엔티티에 위치)
 */
class AdminModel {
  constructor({ admin_id, user_id, permissions, created_at }) {
    this.admin_id = admin_id || null;
    this.user_id = user_id;
    this.permissions = permissions || [];
    this.created_at = created_at || null;
  }
}

module.exports = AdminModel;
