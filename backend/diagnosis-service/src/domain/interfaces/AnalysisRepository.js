class AnalysisRepository {
  async save(analysis) {
    throw new Error("AnalysisRepository.save must be implemented.");
  }

  async findById(id) {
    throw new Error("AnalysisRepository.findById must be implemented.");
  }

  async findHistory({ userId, page, size }) {
    throw new Error("AnalysisRepository.findHistory must be implemented.");
  }
}

module.exports = { AnalysisRepository };
