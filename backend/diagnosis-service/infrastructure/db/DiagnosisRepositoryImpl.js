/**
 * ═══════════════════════════════════════════════
 * Analysis Repository MySQL 구현체 (인프라 계층)
 * ═══════════════════════════════════════════════
 * 
 * diagnosis + image + share_link + log 통합 관리
 */
const DiagnosisRepository = require("../../domain/DiagnosisRepository");
const { Diagnosis } = require("../../domain/Diagnosis");
const { ImageEntity } = require("../../domain/Image");
const { ShareLink } = require("../../domain/ShareLink");
const { DiagnosisLog } = require("../../domain/DiagnosisLog");

class DiagnosisRepositoryImpl extends DiagnosisRepository {
  constructor(pool) { super(); this.pool = pool; }

  // ── 진단 관련 ─────────────────────────────

  async findDiagnosisById(id) {
    const [rows] = await this.pool.execute("SELECT * FROM diagnoses WHERE diagnosis_id = ?", [id]);
    return rows.length ? new Diagnosis(rows[0]) : null;
  }

  async findDiagnosesByUserId(userId, page, limit) {
    const offset = (page - 1) * limit;
    const [rows] = await this.pool.execute(
      "SELECT * FROM diagnoses WHERE user_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?",
      [userId, String(limit), String(offset)]
    );
    return rows.map(r => new Diagnosis(r));
  }

  async saveDiagnosis(d) {
    const [result] = await this.pool.execute(
      "INSERT INTO diagnoses (user_id, diagnosis_type, image_url, status, created_at) VALUES (?, ?, ?, ?, NOW())",
      [d.user_id, d.diagnosis_type, d.image_url, d.status]
    );
    d.diagnosis_id = result.insertId;
    return d;
  }

  async updateDiagnosis(id, fields) {
    const updates = []; const params = [];
    for (const [k, v] of Object.entries(fields)) {
      if (v !== undefined) { updates.push(`${k} = ?`); params.push(v); }
    }
    if (!updates.length) return false;
    params.push(id);
    const [r] = await this.pool.execute(`UPDATE diagnoses SET ${updates.join(", ")} WHERE diagnosis_id = ?`, params);
    return r.affectedRows > 0;
  }

  async countDiagnosesByUserId(userId) {
    const [rows] = await this.pool.execute("SELECT COUNT(*) as total FROM diagnoses WHERE user_id = ?", [userId]);
    return rows[0].total;
  }

  // ── 이미지 관련 ───────────────────────────

  async saveImage(img) {
    const [result] = await this.pool.execute(
      "INSERT INTO images (user_id, diagnosis_id, original_url, processed_url, file_size, mime_type, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())",
      [img.user_id, img.diagnosis_id, img.original_url, img.processed_url, img.file_size, img.mime_type]
    );
    img.image_id = result.insertId;
    return img;
  }

  async findImagesByDiagnosisId(diagnosisId) {
    const [rows] = await this.pool.execute("SELECT * FROM images WHERE diagnosis_id = ?", [diagnosisId]);
    return rows.map(r => new ImageEntity(r));
  }

  // ── 공유 링크 관련 ────────────────────────

  async saveShareLink(link) {
    const [result] = await this.pool.execute(
      "INSERT INTO share_links (diagnosis_id, user_id, share_token, expires_at, is_active, created_at) VALUES (?, ?, ?, ?, ?, NOW())",
      [link.diagnosis_id, link.user_id, link.share_token, link.expires_at, link.is_active]
    );
    link.share_id = result.insertId;
    return link;
  }

  async findShareLinkByToken(token) {
    const [rows] = await this.pool.execute("SELECT * FROM share_links WHERE share_token = ? AND is_active = TRUE", [token]);
    return rows.length ? new ShareLink(rows[0]) : null;
  }

  async deactivateShareLink(shareId) {
    const [r] = await this.pool.execute("UPDATE share_links SET is_active = FALSE WHERE share_id = ?", [shareId]);
    return r.affectedRows > 0;
  }

  // ── 로그 관련 ─────────────────────────────

  async saveLog(log) {
    const [result] = await this.pool.execute(
      "INSERT INTO diagnosis_logs (diagnosis_id, user_id, action, detail, created_at) VALUES (?, ?, ?, ?, NOW())",
      [log.diagnosis_id, log.user_id, log.action, log.detail]
    );
    log.log_id = result.insertId;
    return log;
  }

  async findLogsByDiagnosisId(diagnosisId) {
    const [rows] = await this.pool.execute(
      "SELECT * FROM diagnosis_logs WHERE diagnosis_id = ? ORDER BY created_at DESC", [diagnosisId]
    );
    return rows.map(r => new DiagnosisLog(r));
  }

  async findAllLogs(page, limit) {
    const offset = (page - 1) * limit;
    const [rows] = await this.pool.execute(
      "SELECT * FROM diagnosis_logs ORDER BY created_at DESC LIMIT ? OFFSET ?",
      [String(limit), String(offset)]
    );
    return rows.map(r => new DiagnosisLog(r));
  }

  async countAllLogs() {
    const [rows] = await this.pool.execute("SELECT COUNT(*) as total FROM diagnosis_logs");
    return rows[0].total;
  }
}

module.exports = DiagnosisRepositoryImpl;
