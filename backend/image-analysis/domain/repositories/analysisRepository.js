const analysisRepository = {
  async create() {
    throw new Error("analysisRepository.create is not implemented");
  },
  async findAllForUser() {
    throw new Error("analysisRepository.findAllForUser is not implemented");
  },
  async findByIdForUser() {
    throw new Error("analysisRepository.findByIdForUser is not implemented");
  },
  async deleteManyByIds() {
    throw new Error("analysisRepository.deleteManyByIds is not implemented");
  },
};

module.exports = {
  analysisRepository,
};
