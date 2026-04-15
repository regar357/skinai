CREATE DATABASE IF NOT EXISTS skinai_encyclopedia
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;

USE skinai_disease;

CREATE TABLE IF NOT EXISTS disease_encyclopedia (
  disease_id  INT AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(255) NOT NULL,
  category    VARCHAR(255) NOT NULL,
  description LONGTEXT NOT NULL,
  symptoms    LONGTEXT DEFAULT NULL,
  treatment   LONGTEXT DEFAULT NULL,
  image_url   VARCHAR(255) DEFAULT NULL,
  created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  INDEX idx_disease_name (name),
  INDEX idx_disease_category (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;