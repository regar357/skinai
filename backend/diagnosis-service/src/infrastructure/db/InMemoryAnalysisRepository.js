const { AnalysisRepository } = require("../../domain/interfaces/AnalysisRepository");

class InMemoryAnalysisRepository extends AnalysisRepository {
  constructor(store) {
    super();
    this.store = store;
  }

  async save(analysis) {
    if (!analysis.id) {
      analysis.id = this.store.nextAnalysisId++;
      this.store.analyses.push(analysis);
      return analysis;
    }

    const index = this.store.analyses.findIndex((item) => Number(item.id) === Number(analysis.id));
    if (index >= 0) this.store.analyses[index] = analysis;
    else this.store.analyses.push(analysis);
    return analysis;
  }

  async findById(id) {
    return this.store.analyses.find((analysis) => Number(analysis.id) === Number(id)) || null;
  }

  async findHistory({ userId, page, size }) {
    const currentPage = Math.max(1, Number(page) || 1);
    const pageSize = Math.min(50, Math.max(1, Number(size) || 10));
    const active = this.store.analyses
      .filter((analysis) => Number(analysis.userId) === Number(userId) && analysis.status !== "DELETED")
      .sort((a, b) => {
        const byDate = new Date(b.createdAt) - new Date(a.createdAt);
        return byDate || b.id - a.id;
      });
    const totalItems = active.length;
    const totalPages = Math.ceil(totalItems / pageSize);
    const start = (currentPage - 1) * pageSize;

    return {
      items: active.slice(start, start + pageSize),
      pagination: {
        currentPage,
        totalPages,
        totalItems,
        hasNext: currentPage < totalPages,
        hasPrev: currentPage > 1
      }
    };
  }
}

module.exports = { InMemoryAnalysisRepository };
