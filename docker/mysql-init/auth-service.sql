-- ═══════════════════════════════════════════════
-- SkinAI Auth Service - 독립 DB 스키마
-- Database: skinai_auth
-- 기능: 회원가입(signup), 로그인/로그아웃
-- ═══════════════════════════════════════════════

CREATE DATABASE IF NOT EXISTS skinai_auth DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE skinai_auth;

CREATE TABLE IF NOT EXISTS auth (
  auth_id       INT AUTO_INCREMENT PRIMARY KEY,
  user_id       INT NOT NULL UNIQUE,                -- User Service의 사용자 ID 참조
  email         VARCHAR(255) NOT NULL UNIQUE,       -- 로그인 이메일
  password      VARCHAR(255) NOT NULL,              -- bcrypt 해싱된 비밀번호
  name          VARCHAR(100) DEFAULT NULL,          -- 사용자 이름 (캐시 - 원본은 user-service 보유)
  role          ENUM('user', 'admin') DEFAULT 'user',
  created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_auth_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 초기 관리자 계정 seed (비밀번호: Admin1234!)
-- bcrypt hash of 'Admin1234!' with 10 rounds
INSERT IGNORE INTO auth (user_id, email, password, name, role)
VALUES (0, 'admin@skinai.com', '$2b$10$p.3IqvuxaXiayDy0HsY.WeA2nRdNp5fmhMN5H98kTd3Dlpgckun7q', 'admin', 'admin');
