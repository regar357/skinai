const path = require("path");

const dotenv = require("dotenv");

dotenv.config();

const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  port: Number(process.env.PORT ?? 3001),
  jwtSecret: process.env.JWT_SECRET ?? "graduation-project-secret",
  jwtAlgorithms: (process.env.JWT_ALGORITHMS ?? "HS256").split(","),
  mysqlHost: process.env.MYSQL_HOST ?? "127.0.0.1",
  mysqlPort: Number(process.env.MYSQL_PORT ?? 3306),
  mysqlUser: process.env.MYSQL_USER ?? "root",
  mysqlPassword: process.env.MYSQL_PASSWORD ?? "root",
  mysqlDatabase: process.env.MYSQL_DATABASE ?? "skinai_analysis",
  aiServiceUrl: process.env.AI_SERVICE_URL ?? "http://localhost:8000",
  aiRequestTimeoutMs: Number(process.env.AI_REQUEST_TIMEOUT_MS ?? 30000),
  maxUploadSizeBytes: Number(
    process.env.MAX_UPLOAD_SIZE_BYTES ?? 10 * 1024 * 1024,
  ),
  uploadDirectory:
    process.env.UPLOAD_DIRECTORY ?? path.join(process.cwd(), "uploads"),
};

module.exports = {
  env,
};
