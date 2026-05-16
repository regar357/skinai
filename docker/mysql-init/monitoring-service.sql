-- ═══════════════════════════════════════════════
-- SkinAI Monitoring Service - DB 스키마
-- Database: skinai_monitoring
-- 역할: AI 진단 모니터링 + 대시보드
-- ═══════════════════════════════════════════════

CREATE DATABASE IF NOT EXISTS skinai_monitoring DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE skinai_monitoring;

-- 서비스 상태 스냅샷 테이블 (대시보드용)
CREATE TABLE IF NOT EXISTS service_snapshots (
  snapshot_id   INT AUTO_INCREMENT PRIMARY KEY,
  service_name  VARCHAR(100) NOT NULL,
  status        ENUM('UP', 'DOWN', 'DEGRADED') DEFAULT 'UP',
  response_time_ms INT DEFAULT NULL,
  checked_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_snapshot_service (service_name),
  INDEX idx_snapshot_time (checked_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 진단 통계 캐시 테이블 (대시보드용)
CREATE TABLE IF NOT EXISTS diagnosis_stats (
  stat_id       INT AUTO_INCREMENT PRIMARY KEY,
  stat_date     DATE NOT NULL,
  total_diagnoses INT DEFAULT 0,
  completed     INT DEFAULT 0,
  failed        INT DEFAULT 0,
  avg_confidence DECIMAL(5,2) DEFAULT NULL,
  created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_stat_date (stat_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
