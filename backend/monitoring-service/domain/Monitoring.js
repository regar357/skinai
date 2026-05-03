/**
 * ═══════════════════════════════════════════════
 * Monitoring Domain Entities (도메인 계층)
 * ═══════════════════════════════════════════════
 */

/** 서비스 상태 스냅샷 */
class ServiceSnapshot {
  constructor({ snapshot_id, service_name, status, response_time_ms, checked_at }) {
    this.snapshot_id = snapshot_id || null;
    this.service_name = service_name;
    this.status = status || "UP";
    this.response_time_ms = response_time_ms || null;
    this.checked_at = checked_at || null;
  }
}

/** 진단 통계 */
class DiagnosisStat {
  constructor({ stat_id, stat_date, total_diagnoses, completed, failed, avg_confidence, created_at }) {
    this.stat_id = stat_id || null;
    this.stat_date = stat_date;
    this.total_diagnoses = total_diagnoses || 0;
    this.completed = completed || 0;
    this.failed = failed || 0;
    this.avg_confidence = avg_confidence || null;
    this.created_at = created_at || null;
  }
}

class DomainError extends Error {
  constructor(msg, code = 400) { super(msg); this.statusCode = code; }
}

module.exports = { ServiceSnapshot, DiagnosisStat, DomainError };
