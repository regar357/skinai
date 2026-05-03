const { ImageStorage } = require("../../domain/interfaces/ImageStorage");

class LocalImageStorage extends ImageStorage {
  async buildStoredImage(file) {
    return {
      originalFileName: file.originalname,
      contentType: file.mimetype,
      fileSize: file.size,
      storageKey: file.filename,
      fileUrl: `/uploads/${file.filename}`,
      thumbnailUrl: `/uploads/${file.filename}`,
      checksum: file.checksum
    };
  }
}

module.exports = { LocalImageStorage };
