-- ═══════════════════════════════════════════════
-- SkinAI Auth Service - 독립 DB 스키마
-- Database: skinai_auth
-- 기능: 서비스 가입신청, 로그인/로그아웃
-- ═══════════════════════════════════════════════

CREATE DATABASE IF NOT EXISTS skinai_auth DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE skinai_auth;

CREATE TABLE IF NOT EXISTS auth (
  auth_id       INT AUTO_INCREMENT PRIMARY KEY,
  user_id       INT NOT NULL UNIQUE,                -- User Service의 사용자 ID 참조
  email         VARCHAR(255) NOT NULL UNIQUE,       -- 로그인 이메일
  password      VARCHAR(255) NOT NULL,              -- bcrypt 해싱된 비밀번호
  role          ENUM('user', 'admin') DEFAULT 'user', -- 권한 (사용자/관리자)
  created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_auth_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
