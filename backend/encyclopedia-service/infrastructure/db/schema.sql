-- =============================================
-- SkinAI Encyclopedia Service - 독립 DB 스키마
-- Database: skinai_encyclopedia
-- =============================================

CREATE DATABASE IF NOT EXISTS skinai_encyclopedia
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;

USE skinai_encyclopedia;

CREATE TABLE IF NOT EXISTS encyclopedia_articles (
  article_id        BIGINT AUTO_INCREMENT PRIMARY KEY,
  title             VARCHAR(255) NOT NULL,
  content           LONGTEXT NOT NULL,
  category          VARCHAR(100) NOT NULL,
  icon              VARCHAR(255) DEFAULT NULL,
  icon_bg           VARCHAR(50) DEFAULT NULL,
  icon_color        VARCHAR(50) DEFAULT NULL,
  related_articles  JSON DEFAULT NULL,
  is_active         BOOLEAN NOT NULL DEFAULT TRUE,
  created_at        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  INDEX idx_articles_title (title),
  INDEX idx_articles_category (category),
  INDEX idx_articles_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
