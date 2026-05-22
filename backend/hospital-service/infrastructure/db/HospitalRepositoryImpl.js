/**
 * ═══════════════════════════════════════════════
 * Hospital Repository MySQL 구현체 (인프라 계층)
 * ═══════════════════════════════════════════════
 */
const HospitalRepository = require("../../domain/interfaces/HospitalRepository");
const { Hospital } = require("../../domain/entities/Hospital");

class HospitalRepositoryImpl extends HospitalRepository {
  constructor(pool) {
    super();
    this.pool = pool;
  }

  async findById(hospitalId) {
    const [rows] = await this.pool.execute(
      "SELECT * FROM hospitals WHERE hospital_id = ?",
      [hospitalId],
    );
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
      query = query.replace(
        "HAVING",
        "WHERE (name LIKE ? OR specialties LIKE ?) HAVING",
      );
      params.splice(3, 0, `%${keyword}%`, `%${keyword}%`);
    }

    query += " ORDER BY distance LIMIT 20";
    const [rows] = await this.pool.execute(query, params);
    return rows.map((r) => new Hospital(r));
  }

  async save(hospital) {
    const openHours =
      hospital.open_hours === undefined || hospital.open_hours === null
        ? null
        : JSON.stringify(hospital.open_hours);

    const [result] = await this.pool.execute(
      "INSERT INTO hospitals (name, address, phone, latitude, longitude, rating, open_hours, specialties, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())",
      [
        hospital.name,
        hospital.address,
        hospital.phone,
        hospital.latitude,
        hospital.longitude,
        hospital.rating,
        openHours,
        hospital.specialties,
      ],
    );
    hospital.hospital_id = result.insertId;
    return hospital;
  }

  async findByNameAndAddress(name, address) {
    const [rows] = await this.pool.execute(
      "SELECT * FROM hospitals WHERE name = ? AND address = ? LIMIT 1",
      [name, address],
    );
    return rows.length ? new Hospital(rows[0]) : null;
  }

  async upsert(hospital) {
    const existing = await this.findByNameAndAddress(
      hospital.name,
      hospital.address,
    );

    if (!existing) {
      return this.save(hospital);
    }

    const openHours =
      hospital.open_hours === undefined || hospital.open_hours === null
        ? null
        : JSON.stringify(hospital.open_hours);

    await this.pool.execute(
      `
        UPDATE hospitals
        SET phone = COALESCE(?, phone),
            latitude = ?,
            longitude = ?,
            rating = COALESCE(?, rating),
            open_hours = COALESCE(?, open_hours),
            specialties = COALESCE(?, specialties)
        WHERE hospital_id = ?
      `,
      [
        hospital.phone || null,
        hospital.latitude,
        hospital.longitude,
        hospital.rating || null,
        openHours,
        hospital.specialties || null,
        existing.hospital_id,
      ],
    );

    return this.findById(existing.hospital_id);
  }

  async upsertMany(hospitals) {
    const saved = [];
    for (const hospital of hospitals) {
      saved.push(await this.upsert(hospital));
    }
    return saved;
  }
}

module.exports = HospitalRepositoryImpl;
