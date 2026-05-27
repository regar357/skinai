class InternalAdminService {
  constructor(pool, storageService) {
    this.pool = pool;
    this.storageService = storageService;
  }

  async getExamRecords({ page = 1, limit = 10, search }) {
    const offset = (page - 1) * limit;
    const params = [];
    let where = "";
    if (search) {
      where = "WHERE result_summary LIKE ? OR diagnosis_type LIKE ?";
      params.push(`%${search}%`, `%${search}%`);
    }
    const [rows] = await this.pool.execute(
      `SELECT diagnosis_id, user_id, diagnosis_type, result_summary,
              ai_confidence, status, created_at, image_url
       FROM diagnoses ${where} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      [...params, String(limit), String(offset)],
    );
    const [[{ total }]] = await this.pool.query(
      `SELECT COUNT(*) AS total FROM diagnoses ${where}`,
      params,
    );

    const data = await Promise.all(
      rows.map(async (row) => ({
        ...row,
        image_url: this.storageService
          ? await this.storageService.getSignedUrl(row.image_url)
          : row.image_url,
      })),
    );

    return {
      data,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async getImageInfo(imageId) {
    const [rows] = await this.pool.execute(
      `SELECT image_id, user_id, diagnosis_id, original_url AS image_url,
              processed_url, file_size, mime_type, created_at AS uploaded_at
       FROM images WHERE image_id = ? LIMIT 1`,
      [imageId],
    );
    return rows[0] || null;
  }
}

module.exports = InternalAdminService;
