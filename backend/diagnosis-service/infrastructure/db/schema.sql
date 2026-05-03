-- ═══════════════════════════════════════════════
-- SkinAI Analysis Service - 통합 DB 스키마
-- Database: skinai_diagnosis
-- 통합: diagnosis + image + 공유링크 + 분석로그
-- ═══════════════════════════════════════════════

CREATE DATABASE IF NOT EXISTS skinai_diagnosis DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE skinai_diagnosis;

-- 진단 테이블
CREATE TABLE IF NOT EXISTS diagnoses (
  diagnosis_id  INT AUTO_INCREMENT PRIMARY KEY,
  user_id       INT NOT NULL,
  diagnosis_type ENUM('skin', 'face') NOT NULL,
  result_summary TEXT DEFAULT NULL,
  image_url     VARCHAR(500) DEFAULT NULL,
  ai_confidence DECIMAL(5,2) DEFAULT NULL,
  status        ENUM('pending', 'processing', 'completed', 'failed') DEFAULT 'pending',
  created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_diag_user (user_id),
  INDEX idx_diag_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 이미지 테이블 (S3 저장 메타데이터)
CREATE TABLE IF NOT EXISTS images (
  image_id      INT AUTO_INCREMENT PRIMARY KEY,
  user_id       INT NOT NULL,
  diagnosis_id  INT DEFAULT NULL,
  original_url  VARCHAR(500) NOT NULL,
  processed_url VARCHAR(500) DEFAULT NULL,
  file_size     INT DEFAULT 0,
  mime_type     VARCHAR(50) DEFAULT 'image/jpeg',
  created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_img_user (user_id),
  INDEX idx_img_diagnosis (diagnosis_id),
  FOREIGN KEY (diagnosis_id) REFERENCES diagnoses(diagnosis_id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 분석 결과 공유 링크 테이블
CREATE TABLE IF NOT EXISTS share_links (
  share_id      INT AUTO_INCREMENT PRIMARY KEY,
  diagnosis_id  INT NOT NULL,
  user_id       INT NOT NULL,
  share_token   VARCHAR(255) NOT NULL UNIQUE,
  expires_at    DATETIME DEFAULT NULL,
  is_active     BOOLEAN DEFAULT TRUE,
  created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_share_token (share_token),
  INDEX idx_share_diagnosis (diagnosis_id),
  FOREIGN KEY (diagnosis_id) REFERENCES diagnoses(diagnosis_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 분석 결과 로그 테이블
CREATE TABLE IF NOT EXISTS diagnosis_logs (
  log_id        INT AUTO_INCREMENT PRIMARY KEY,
  diagnosis_id  INT NOT NULL,
  user_id       INT NOT NULL,
  action        VARCHAR(100) NOT NULL,       -- 예: 'created', 'completed', 'shared', 'viewed'
  detail        TEXT DEFAULT NULL,
  created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_log_diagnosis (diagnosis_id),
  INDEX idx_log_user (user_id),
  INDEX idx_log_action (action),
  FOREIGN KEY (diagnosis_id) REFERENCES diagnoses(diagnosis_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
