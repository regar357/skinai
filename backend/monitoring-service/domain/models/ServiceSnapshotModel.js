/**
 * ═══════════════════════════════════════════════
 * ServiceSnapshot Data Model (도메인 계층 - 데이터 모델)
 * ═══════════════════════════════════════════════
 *
 * 역할: ServiceSnapshot 데이터의 필드 정의 (DTO/순수 데이터)
 * - 비즈니스 규칙 없음 (검증/동작 메서드는 ServiceSnapshot 엔티티에 위치)
 */
class ServiceSnapshotModel {
  constructor({ snapshot_id, service_name, status, response_time_ms, checked_at }) {
    this.snapshot_id = snapshot_id || null;
    this.service_name = service_name;
    this.status = status || "UP";
    this.response_time_ms = response_time_ms || null;
    this.checked_at = checked_at || null;
  }
}

module.exports = ServiceSnapshotModel;
