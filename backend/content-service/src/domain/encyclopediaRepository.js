class EncyclopediaRepository {
  async findAll({ query, page, size }) {
    throw new Error("EncyclopediaRepository.findAll must be implemented");
  }

  async findById(id) {
    throw new Error("EncyclopediaRepository.findById must be implemented");
  }

  async create({ title, content }) {
    throw new Error("EncyclopediaRepository.create must be implemented");
  }

  async update(id, { title, content }) {
    throw new Error("EncyclopediaRepository.update must be implemented");
  }

  async delete(id) {
    throw new Error("EncyclopediaRepository.delete must be implemented");
  }
}

module.exports = EncyclopediaRepository;
