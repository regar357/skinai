CREATE DATABASE IF NOT EXISTS skinai_diagnosis DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE skinai_diagnosis;

CREATE TABLE diagnosis_images (
  image_id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  original_file_name VARCHAR(255) NOT NULL,
  content_type VARCHAR(100) NOT NULL,
  file_size BIGINT NOT NULL,
  storage_key VARCHAR(512) NOT NULL UNIQUE,
  file_url VARCHAR(1000) NOT NULL,
  thumbnail_url VARCHAR(1000) NULL,
  checksum CHAR(64) NULL,
  status ENUM('UPLOADED', 'ANALYZED', 'DELETED') NOT NULL DEFAULT 'UPLOADED',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deleted_at DATETIME NULL,
  INDEX idx_diagnosis_images_user_created (user_id, created_at DESC),
  INDEX idx_diagnosis_images_status (status)
);

CREATE TABLE analysis_results (
  analysis_id BIGINT PRIMARY KEY AUTO_INCREMENT,
  image_id BIGINT NOT NULL,
  user_id BIGINT NOT NULL,
  status ENUM('PROCESSING', 'COMPLETED', 'FAILED', 'DELETED') NOT NULL,
  suspected_disease VARCHAR(255) NULL,
  probability TINYINT UNSIGNED NULL,
  raw_result_json JSON NULL,
  error_message TEXT NULL,
  analyzed_at DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deleted_at DATETIME NULL,
  CONSTRAINT fk_analysis_results_image
    FOREIGN KEY (image_id) REFERENCES diagnosis_images(image_id),
  INDEX idx_analysis_results_user_created (user_id, created_at DESC),
  INDEX idx_analysis_results_image (image_id),
  INDEX idx_analysis_results_status (status)
);
