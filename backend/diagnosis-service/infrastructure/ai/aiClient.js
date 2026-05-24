const { URL } = require("url");
const http = require("http");
const https = require("https");

const aiServiceUrl = process.env.AI_SERVICE_URL || "http://localhost:8001";
const aiServicePath = process.env.AI_SERVICE_PATH || "/api/v1/predict";

function createMultipartBody(buffer, mimeType, filename) {
  const boundary = `----SkinAI${Date.now()}${Math.random().toString(16).slice(2)}`;
  const header = Buffer.from(
    `--${boundary}\r\n` +
      `Content-Disposition: form-data; name="file"; filename="${filename}"\r\n` +
      `Content-Type: ${mimeType}\r\n\r\n`,
    "utf8",
  );
  const footer = Buffer.from(`\r\n--${boundary}--\r\n`, "utf8");
  return { body: Buffer.concat([header, buffer, footer]), boundary };
}

async function sendImage(buffer, mimeType, filename = "image.jpg") {
  if (!buffer) throw new Error("이미지 버퍼가 필요합니다.");
  const target = new URL(aiServiceUrl);
  const isHttps = target.protocol === "https:";
  const { body, boundary } = createMultipartBody(buffer, mimeType, filename);
  const options = {
    hostname: target.hostname,
    port: target.port || (isHttps ? 443 : 80),
    path: aiServicePath,
    method: "POST",
    headers: {
      "Content-Type": `multipart/form-data; boundary=${boundary}`,
      "Content-Length": body.length,
    },
  };

  return new Promise((resolve, reject) => {
    const req = (isHttps ? https : http).request(options, (res) => {
      const chunks = [];
      res.on("data", (c) => chunks.push(c));
      res.on("end", () => {
        const bodyString = Buffer.concat(chunks).toString("utf8");
        if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
          try {
            const json = JSON.parse(bodyString);
            return resolve(json);
          } catch (parseErr) {
            return reject(
              new Error(`AI 응답 JSON 파싱 실패: ${parseErr.message}`),
            );
          }
        }
        reject(new Error(`AI 응답 오류: ${res.statusCode} ${bodyString}`));
      });
    });
    req.on("error", (err) => reject(err));
    req.write(body);
    req.end();
  });
}

module.exports = { sendImage };
