/**
 * ═══════════════════════════════════════════════
 * MySQL 커넥션 풀 (인프라 계층)
 * ═══════════════════════════════════════════════
 * 
 * 역할: User Service 전용 DB 연결 관리
 * - MSA에서 각 서비스는 자기만의 DB를 가짐 (skinai_user)
 * - 커넥션 풀로 DB 연결을 재사용하여 성능 향상
 */
const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "1234",
  database: process.env.USER_DB_NAME || "skinai_user",
  port: parseInt(process.env.DB_PORT, 10) || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

module.exports = pool;
