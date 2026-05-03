class ImageStorage {
  async buildStoredImage(file) {
    throw new Error("ImageStorage.buildStoredImage must be implemented.");
  }
}

module.exports = { ImageStorage };
