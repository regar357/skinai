-- ═══════════════════════════════════════════════
-- SkinAI Content Service - 통합 DB 스키마
-- Database: skinai_content
-- 통합: 피부백과 + 공지사항
-- ═══════════════════════════════════════════════

CREATE DATABASE IF NOT EXISTS skinai_content DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE skinai_content;

-- 피부백과 테이블
CREATE TABLE IF NOT EXISTS articles (
  article_id  INT AUTO_INCREMENT PRIMARY KEY,
  title       VARCHAR(255) NOT NULL,
  content     LONGTEXT NOT NULL,
  category    VARCHAR(100) DEFAULT NULL,
  image_url   VARCHAR(500) DEFAULT NULL,
  view_count  INT DEFAULT 0,
  created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_article_category (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 공지사항 테이블
CREATE TABLE IF NOT EXISTS notices (
  notice_id   INT AUTO_INCREMENT PRIMARY KEY,
  admin_id    INT NOT NULL,
  title       VARCHAR(255) NOT NULL,
  content     LONGTEXT NOT NULL,
  is_pinned   BOOLEAN DEFAULT FALSE,
  created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_notice_pinned (is_pinned)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
