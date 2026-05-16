CREATE DATABASE IF NOT EXISTS skinai_monitoring DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE skinai_monitoring;

CREATE TABLE IF NOT EXISTS performance_metrics (
  metric_id INT AUTO_INCREMENT PRIMARY KEY,
  metric_month CHAR(7) NOT NULL,
  accuracy DECIMAL(5,2) NOT NULL DEFAULT 0,
  precision_score DECIMAL(5,2) NOT NULL DEFAULT 0,
  recall_score DECIMAL(5,2) NOT NULL DEFAULT 0,
  f1_score DECIMAL(5,2) NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_metric_month (metric_month)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS disease_accuracy_metrics (
  metric_id INT AUTO_INCREMENT PRIMARY KEY,
  disease_name VARCHAR(100) NOT NULL,
  accuracy DECIMAL(5,2) NOT NULL DEFAULT 0,
  measured_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_disease_name (disease_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS system_status_metrics (
  status_id INT AUTO_INCREMENT PRIMARY KEY,
  average_response_time INT NOT NULL DEFAULT 0,
  daily_requests INT NOT NULL DEFAULT 0,
  error_rate DECIMAL(5,2) NOT NULL DEFAULT 0,
  uptime DECIMAL(5,2) NOT NULL DEFAULT 0,
  measured_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_system_status_measured_at (measured_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
