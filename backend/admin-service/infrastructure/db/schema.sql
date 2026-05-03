-- ═══════════════════════════════════════════════
-- SkinAI Admin Service - DB 스키마
-- Database: skinai_admin
-- 역할: 서비스 통신 (내부 API)
-- ═══════════════════════════════════════════════

CREATE DATABASE IF NOT EXISTS skinai_admin DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE skinai_admin;

-- 관리자 테이블
CREATE TABLE IF NOT EXISTS admins (
  admin_id    INT AUTO_INCREMENT PRIMARY KEY,
  user_id     INT NOT NULL UNIQUE,
  permissions JSON DEFAULT NULL,
  created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
