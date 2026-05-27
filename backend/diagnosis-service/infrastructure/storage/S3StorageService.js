const { S3Client, PutObjectCommand, GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { v4: uuidv4 } = require("uuid");
const path = require("path");

class S3StorageService {
  constructor() {
    this.client = new S3Client({
      region: process.env.AWS_REGION || "ap-northeast-2",
      // EC2 Instance Profile 사용 시 credentials 생략 → SDK가 자동으로 인식
      // IAM 액세스 키가 있을 경우에만 아래 주석 해제
      // credentials: {
      //   accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      //   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      // },
    });
    this.bucket = process.env.S3_BUCKET_NAME;
  }

  async upload(file, userId) {
    const ext = path.extname(file.originalname || "image.jpg") || ".jpg";
    const key = `diagnoses/${userId}/${Date.now()}-${uuidv4()}${ext}`;

    await this.client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype || "image/jpeg",
      })
    );

    // DB에는 원본 S3 URL 저장 (영구 식별자)
    return `https://${this.bucket}.s3.${process.env.AWS_REGION || "ap-northeast-2"}.amazonaws.com/${key}`;
  }

  // S3 URL → 1시간 유효 Presigned URL 변환
  async getSignedUrl(rawUrl) {
    if (!rawUrl) return "";
    try {
      const url = new URL(rawUrl);
      const key = url.pathname.slice(1); // 앞의 '/' 제거
      const command = new GetObjectCommand({ Bucket: this.bucket, Key: key });
      return await getSignedUrl(this.client, command, { expiresIn: 3600 });
    } catch {
      return rawUrl;
    }
  }
}

module.exports = S3StorageService;
