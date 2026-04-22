const fs = require("fs");
const path = require("path");

const multer = require("multer");

const { env } = require("../config/env");

fs.mkdirSync(env.uploadDirectory, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, env.uploadDirectory);
  },
  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname);
    const safeBaseName = path
      .basename(file.originalname, extension)
      .replace(/[^a-zA-Z0-9-_]/g, "-")
      .slice(0, 50);

    cb(null, `${Date.now()}-${safeBaseName}${extension}`);
  },
});

function imageFileFilter(req, file, cb) {
  if (!file.mimetype.startsWith("image/")) {
    const error = new Error("Only image files can be uploaded.");
    error.statusCode = 400;
    return cb(error);
  }

  return cb(null, true);
}

const uploadImage = multer({
  storage,
  fileFilter: imageFileFilter,
  limits: {
    fileSize: env.maxUploadSizeBytes,
  },
});

// S3 storage 주석 포인트:
// 나중에 S3로 교체할 때 필요한 로직 작성

module.exports = {
  uploadImage,
};
