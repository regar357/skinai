class NoticeRepository {
  async findAll({ page, size }) {
    throw new Error("NoticeRepository.findAll must be implemented");
  }

  async findById(id) {
    throw new Error("NoticeRepository.findById must be implemented");
  }

  async create({ title, content }) {
    throw new Error("NoticeRepository.create must be implemented");
  }

  async update(id, { title, content }) {
    throw new Error("NoticeRepository.update must be implemented");
  }

  async delete(id) {
    throw new Error("NoticeRepository.delete must be implemented");
  }
}

module.exports = NoticeRepository;
