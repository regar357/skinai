class ImageRepository {
  async save(image) {
    throw new Error("ImageRepository.save must be implemented.");
  }

  async findById(id) {
    throw new Error("ImageRepository.findById must be implemented.");
  }
}

module.exports = { ImageRepository };
