/**
 * ═══════════════════════════════════════════════
 * Hospital Repository MySQL 구현체 (인프라 계층)
 * ═══════════════════════════════════════════════
 */
const HospitalRepository = require("../../domain/HospitalRepository");
const { Hospital } = require("../../domain/Hospital");

class HospitalRepositoryImpl extends HospitalRepository {
  constructor(pool) { super(); this.pool = pool; }

  async findById(hospitalId) {
    const [rows] = await this.pool.execute("SELECT * FROM hospitals WHERE hospital_id = ?", [hospitalId]);
    return rows.length ? new Hospital(rows[0]) : null;
  }

  async findNearby(latitude, longitude, radius, keyword) {
    // Haversine 공식으로 거리 기반 검색
    let query = `
      SELECT *, (
        6371000 * acos(
          cos(radians(?)) * cos(radians(latitude)) *
          cos(radians(longitude) - radians(?)) +
          sin(radians(?)) * sin(radians(latitude))
        )
      ) AS distance
      FROM hospitals
      HAVING distance <= ?
    `;
    const params = [latitude, longitude, latitude, radius];

    if (keyword) {
      query = query.replace("HAVING", "WHERE (name LIKE ? OR specialties LIKE ?) HAVING");
      params.splice(3, 0, `%${keyword}%`, `%${keyword}%`);
    }

    query += " ORDER BY distance LIMIT 20";
    const [rows] = await this.pool.execute(query, params);
    return rows.map(r => new Hospital(r));
  }

  async save(hospital) {
    const [result] = await this.pool.execute(
      "INSERT INTO hospitals (name, address, phone, latitude, longitude, rating, open_hours, specialties, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())",
      [hospital.name, hospital.address, hospital.phone, hospital.latitude, hospital.longitude, hospital.rating, JSON.stringify(hospital.open_hours), hospital.specialties]
    );
    hospital.hospital_id = result.insertId;
    return hospital;
  }
}

module.exports = HospitalRepositoryImpl;
