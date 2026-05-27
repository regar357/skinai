const LocalStorageService = require("./LocalStorageService");
const S3StorageService = require("./S3StorageService");

// NODE_ENV=production 이면 S3, 그 외엔 로컬 파일 시스템 사용
function createStorageService() {
  if (process.env.NODE_ENV === "production") {
    return new S3StorageService();
  }
  return new LocalStorageService();
}

module.exports = createStorageService();
