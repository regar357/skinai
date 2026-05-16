-- ═══════════════════════════════════════════════
-- SkinAI User Service - 독립 DB 스키마
-- Database: skinai_user
-- ═══════════════════════════════════════════════

CREATE DATABASE IF NOT EXISTS skinai_user
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;

USE skinai_user;

-- 사용자 테이블
CREATE TABLE IF NOT EXISTS users (
  user_id       INT AUTO_INCREMENT PRIMARY KEY,
  email         VARCHAR(255) NOT NULL UNIQUE,     -- 로그인 이메일
  password      VARCHAR(255) NOT NULL,            -- bcrypt 해싱된 비밀번호
  name          VARCHAR(100) NOT NULL,            -- 사용자 이름
  phone         VARCHAR(20) DEFAULT NULL,         -- 전화번호 (선택)
  birth_date    DATE DEFAULT NULL,                -- 생년월일 (선택)
  gender        ENUM('M', 'F', 'OTHER') DEFAULT NULL, -- 성별 (선택)
  status        ENUM('active', 'inactive', 'suspended') DEFAULT 'active', -- 계정 상태
  last_login_at DATETIME DEFAULT NULL,            -- 마지막 로그인 시각
  created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  INDEX idx_users_email (email),
  INDEX idx_users_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
