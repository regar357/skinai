function createInMemoryStore() {
  return {
    images: [],
    analyses: [],
    nextImageId: 1,
    nextAnalysisId: 1
  };
}

module.exports = { createInMemoryStore };
