-- =============================================
-- SkinAI Feedback Service - 독립 DB 스키마
-- Database: skinai_feedback
-- =============================================

CREATE DATABASE IF NOT EXISTS skinai_feedback
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;

USE skinai_feedback;

-- 피드백 테이블 (앱 일반 피드백 - rating + content)
CREATE TABLE IF NOT EXISTS feedbacks (
  feedback_id   INT AUTO_INCREMENT PRIMARY KEY,
  user_id       INT NOT NULL,
  rating        TINYINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  content       TEXT DEFAULT NULL,
  reply_text    TEXT DEFAULT NULL,
  replied_at    DATETIME DEFAULT NULL,
  created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  INDEX idx_feedbacks_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
