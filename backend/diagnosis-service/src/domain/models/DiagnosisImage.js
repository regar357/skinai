const { domainError } = require("../shared/error");

class DiagnosisImage {
  constructor({
    id,
    userId,
    originalFileName,
    contentType,
    fileSize,
    storageKey,
    fileUrl,
    thumbnailUrl,
    checksum,
    status = "UPLOADED",
    createdAt = new Date(),
    deletedAt = null,
  }) {
    if (!userId) throw domainError("InvalidUser", "userId is required.");
    if (!ALLOWED_IMAGE_TYPES.has(contentType)) {
      throw domainError(
        "UnsupportedImageType",
        "Only jpeg, png, and webp images are supported.",
      );
    }

    this.id = id;
    this.userId = Number(userId);
    this.originalFileName = originalFileName;
    this.contentType = contentType;
    this.fileSize = fileSize;
    this.storageKey = storageKey;
    this.fileUrl = fileUrl;
    this.thumbnailUrl = thumbnailUrl || fileUrl;
    this.checksum = checksum;
    this.status = status;
    this.createdAt = createdAt;
    this.deletedAt = deletedAt;
  }

  markAnalyzed() {
    this.status = "ANALYZED";
  }
}

module.exports = { DiagnosisImage, ALLOWED_IMAGE_TYPES };
