const mysql = require("mysql2/promise");

// schema.sql 실행: mysql -u root -p skinai_diagnosis < schema.sql
// 또는 mysql -u root -p < schema.sql (schema.sql 내 USE 문으로 DB 자동 선택)

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: "skinai_diagnosis",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

async function initializeDatabase() {
  const connection = await pool.getConnection();
  try {
    await connection.query("SELECT 1");
    console.log("Database connection successful");
  } catch (error) {
    console.error("Database connection failed:", error);
    throw error;
  } finally {
    connection.release();
  }
}

function getPool() {
  return pool;
}

module.exports = { pool, getPool, initializeDatabase };
