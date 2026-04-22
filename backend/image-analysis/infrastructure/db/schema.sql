-- =============================================
-- SkinAI Image Analysis Service - 독립 DB 스키마
-- Database: skinai_image_analysis
-- =============================================

CREATE DATABASE IF NOT EXISTS skinai_image_analysis
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;

USE skinai_image_analysis;

CREATE TABLE IF NOT EXISTS analysis_results (
  analysis_id          BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id              INT NOT NULL,
  image_url            VARCHAR(500) NOT NULL,
  thumbnail_url        VARCHAR(500) DEFAULT NULL,
  gender               ENUM('male', 'female') NOT NULL,
  age                  INT NOT NULL,
  overall_score        DECIMAL(5, 2) NOT NULL DEFAULT 0,
  status               ENUM('good', 'warn') NOT NULL DEFAULT 'warn',
  summary              TEXT NOT NULL,
  detail_moisture      DECIMAL(5, 2) NOT NULL DEFAULT 0,
  detail_uv            DECIMAL(5, 2) NOT NULL DEFAULT 0,
  detail_barrier       DECIMAL(5, 2) NOT NULL DEFAULT 0,
  detail_sebum         DECIMAL(5, 2) NOT NULL DEFAULT 0,
  recommendations_json JSON NOT NULL,
  created_at           DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

  INDEX idx_analysis_user_id (user_id),
  INDEX idx_analysis_created_at (created_at),
  INDEX idx_analysis_user_created_at (user_id, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
