-- =============================================
-- SkinAI Feedback Service - 독립 DB 스키마
-- Database: skinai_feedback
-- =============================================

CREATE DATABASE IF NOT EXISTS skinai_feedback
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;

USE skinai_feedback;

-- 진단 참조 테이블 (서비스 간 데이터 정합성용)
-- MSA에서는 다른 서비스의 테이블을 직접 참조하지 않으므로
-- 최소한의 참조 데이터만 로컬에 보관
CREATE TABLE IF NOT EXISTS diagnoses (
  diagnosis_id  INT PRIMARY KEY,
  user_id       INT NOT NULL,
  synced_at     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

  INDEX idx_diagnoses_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 피드백 테이블
CREATE TABLE IF NOT EXISTS feedbacks (
  feedback_id   INT AUTO_INCREMENT PRIMARY KEY,
  diagnosis_id  INT NOT NULL,
  user_id       INT NOT NULL,
  rating        TINYINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  content       TEXT DEFAULT NULL,
  created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  UNIQUE KEY uq_feedback_diagnosis_user (diagnosis_id, user_id),
  INDEX idx_feedbacks_user (user_id),
  INDEX idx_feedbacks_diagnosis (diagnosis_id),
  FOREIGN KEY (diagnosis_id) REFERENCES diagnoses(diagnosis_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
