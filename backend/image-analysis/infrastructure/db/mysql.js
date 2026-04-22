const mysql = require("mysql2/promise");

const { env } = require("../config/env");

let pool;

function getPool() {
  if (!pool) {
    pool = mysql.createPool({
      host: env.mysqlHost,
      port: env.mysqlPort,
      user: env.mysqlUser,
      password: env.mysqlPassword,
      database: env.mysqlDatabase,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
  }

  return pool;
}

module.exports = {
  getPool,
};
