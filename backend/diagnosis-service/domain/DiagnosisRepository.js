/**
 * ═══════════════════════════════════════════════
 * Analysis Repository Interface (도메인 계층)
 * ═══════════════════════════════════════════════
 */
class DiagnosisRepository {
  // 진단 관련
  async findDiagnosisById(id) { throw new Error("구현 필요"); }
  async findDiagnosesByUserId(userId, page, limit) { throw new Error("구현 필요"); }
  async saveDiagnosis(diagnosis) { throw new Error("구현 필요"); }
  async updateDiagnosis(id, fields) { throw new Error("구현 필요"); }
  async countDiagnosesByUserId(userId) { throw new Error("구현 필요"); }

  // 이미지 관련
  async saveImage(image) { throw new Error("구현 필요"); }
  async findImagesByDiagnosisId(diagnosisId) { throw new Error("구현 필요"); }

  // 공유 링크 관련
  async saveShareLink(shareLink) { throw new Error("구현 필요"); }
  async findShareLinkByToken(token) { throw new Error("구현 필요"); }
  async deactivateShareLink(shareId) { throw new Error("구현 필요"); }

  // 로그 관련
  async saveLog(log) { throw new Error("구현 필요"); }
  async findLogsByDiagnosisId(diagnosisId) { throw new Error("구현 필요"); }
  async findAllLogs(page, limit) { throw new Error("구현 필요"); }
  async countAllLogs() { throw new Error("구현 필요"); }
}

module.exports = DiagnosisRepository;
