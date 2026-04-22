const fs = require("fs");

const axios = require("axios");
const FormData = require("form-data");

const { env } = require("../config/env");

async function requestAnalysis({ file, gender, age }) {
  const formData = new FormData();
  formData.append("image", fs.createReadStream(file.path), file.originalname);
  formData.append("gender", gender);
  formData.append("age", String(age));

  try {
    const response = await axios.post(`${env.aiServiceUrl}/predict`, formData, {
      headers: formData.getHeaders(),
      timeout: env.aiRequestTimeoutMs,
      maxBodyLength: Infinity,
      maxContentLength: Infinity,
    });

    return response.data;
  } catch (error) {
    const serviceError = new Error("Failed to receive a valid response from the AI service.");
    serviceError.statusCode = 502;
    serviceError.details = error.response?.data ?? error.message;
    throw serviceError;
  }
}

module.exports = {
  requestAnalysis,
};
