const crypto = require("crypto");
const fs = require("fs");
const fsPromises = require("fs/promises");
const multer = require("multer");
const path = require("path");

const uploadDir = path.resolve(__dirname, "..", "..", "..", "uploads");
const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp"]);

function createUploadMiddleware() {
  fs.mkdirSync(uploadDir, { recursive: true });

  const upload = multer({
    storage: multer.diskStorage({
      destination: uploadDir,
      filename(req, file, callback) {
        const ext = extensionFromMime(file.mimetype);
        callback(null, `diagnosis_${Date.now()}_${crypto.randomUUID()}${ext}`);
      }
    }),
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter(req, file, callback) {
      if (allowedTypes.has(file.mimetype)) return callback(null, true);
      const error = new Error("Only jpeg, png, and webp images are supported.");
      error.statusCode = 400;
      error.code = "UnsupportedImageType";
      return callback(error);
    }
  });

  return [
    upload.single("image"),
    async (req, res, next) => {
      try {
        if (req.file) {
          req.file.checksum = await checksum(req.file.path);
          // 개발 단계는 로컬 uploads 폴더에 저장한다.
          // 배포 단계에서는 이 지점을 S3 업로드 미들웨어 또는 S3 storage adapter로 교체한다.
        }
        next();
      } catch (error) {
        next(error);
      }
    }
  ];
}

function extensionFromMime(mime) {
  if (mime === "image/png") return ".png";
  if (mime === "image/webp") return ".webp";
  return ".jpg";
}

async function checksum(filePath) {
  const buffer = await fsPromises.readFile(filePath);
  return crypto.createHash("sha256").update(buffer).digest("hex");
}

module.exports = { createUploadMiddleware, uploadDir };
