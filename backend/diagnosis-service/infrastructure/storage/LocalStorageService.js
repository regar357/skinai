const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const UPLOAD_DIR = path.join(__dirname, "../../uploads");
const SERVICE_URL = process.env.DIAGNOSIS_SERVICE_URL || "http://localhost:3004";

class LocalStorageService {
  async getSignedUrl(url) {
    return url; // 로컬은 바로 접근 가능하므로 그대로 반환
  }

  async upload(file, userId) {
    if (!fs.existsSync(UPLOAD_DIR)) {
      fs.mkdirSync(UPLOAD_DIR, { recursive: true });
    }

    const ext = path.extname(file.originalname || "image.jpg") || ".jpg";
    const filename = `${uuidv4()}${ext}`;
    fs.writeFileSync(path.join(UPLOAD_DIR, filename), file.buffer);

    return `${SERVICE_URL}/uploads/${filename}`;
  }
}

module.exports = LocalStorageService;
