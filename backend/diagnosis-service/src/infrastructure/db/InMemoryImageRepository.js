const { ImageRepository } = require("../../domain/interfaces/ImageRepository");

class InMemoryImageRepository extends ImageRepository {
  constructor(store) {
    super();
    this.store = store;
  }

  async save(image) {
    if (!image.id) {
      image.id = this.store.nextImageId++;
      this.store.images.push(image);
      return image;
    }

    const index = this.store.images.findIndex((item) => Number(item.id) === Number(image.id));
    if (index >= 0) this.store.images[index] = image;
    else this.store.images.push(image);
    return image;
  }

  async findById(id) {
    return this.store.images.find((image) => Number(image.id) === Number(id)) || null;
  }
}

module.exports = { InMemoryImageRepository };
