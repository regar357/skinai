const {
  AiDiagnosisClient,
} = require("../../domain/interfaces/AiDiagnosisClient");

class FastApiDiagnosisClient extends AiDiagnosisClient {
  constructor({ baseUrl = process.env.AI_SERVER_URL } = {}) {
    super();
    this.baseUrl = baseUrl;
  }

  async analyze({ file }) {
    const form = new FormData();
    const buffer =
      file.buffer || (await require("fs/promises").readFile(file.path));
    const blob = new Blob([buffer], { type: file.mimetype });
    form.append("image", blob, file.originalname || "image.jpg");

    const response = await fetch(`${this.baseUrl}/predict`, {
      method: "POST",
      body: form,
    });

    if (!response.ok) {
      throw new Error(`AI server error: ${response.status}`);
    }

    const data = await response.json();
    return {
      suspectedDisease:
        data.suspectedDisease ||
        data.suspected_disease ||
        data.disease ||
        data.label ||
        "기저세포암",
      probability: data.probability ?? data.confidence ?? data.score ?? 0,
      raw: data,
    };
  }
}

module.exports = { FastApiDiagnosisClient };
