/**
 * ═══════════════════════════════════════════════
 * Hospital Repository Interface (도메인 계층)
 * ═══════════════════════════════════════════════
 */
class HospitalRepository {
  async findById(hospitalId) {
    throw new Error("구현 필요");
  }
  async findNearby(latitude, longitude, radius, keyword) {
    throw new Error("구현 필요");
  }
  async save(hospital) {
    throw new Error("구현 필요");
  }
  async upsert(hospital) {
    throw new Error("구현 필요");
  }
  async upsertMany(hospitals) {
    throw new Error("구현 필요");
  }
}

module.exports = HospitalRepository;
