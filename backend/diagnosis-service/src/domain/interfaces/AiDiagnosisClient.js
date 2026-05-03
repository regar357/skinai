class AiDiagnosisClient {
  async analyze({ file, imageUrl }) {
    throw new Error("AiDiagnosisClient.analyze must be implemented.");
  }
}

module.exports = { AiDiagnosisClient };
