const pool = require("../infrastructure/db");
const { Disease } = require("../domain/models/Disease");

exports.listDiseases = async ({ category, keyword }) => {
  let sql =
    "SELECT disease_id, name, category, image_url FROM disease_encyclopedia";
  const params = [];

  if (category && keyword) {
    sql +=
      " WHERE category = ? AND (name LIKE ? OR description LIKE ? OR content LIKE ?)";
    params.push(category, `%${keyword}%`, `%${keyword}%`, `%${keyword}%`);
  } else if (category) {
    sql += " WHERE category = ?";
    params.push(category);
  } else if (keyword) {
    sql += " WHERE name LIKE ? OR description LIKE ? OR content LIKE ?";
    params.push(`%${keyword}%`, `%${keyword}%`, `%${keyword}%`);
  }

  const [rows] = await pool.execute(sql, params);
  return rows.map((row) => new Disease(row));
};

exports.getDiseaseById = async (diseaseId) => {
  const [rows] = await pool.execute(
    `SELECT disease_id, name, category, description, symptoms, treatment, image_url, created_at, updated_at
     FROM disease_encyclopedia
     WHERE disease_id = ?`,
    [diseaseId],
  );

  return rows[0] ? new Disease(rows[0]) : null;
};

exports.createDisease = async (payload) => {
  const { name, category, description, symptoms, treatment, image_url } =
    payload;
  if (!name || !category || !description) {
    const error = new Error("name, category, description 항목은 필수입니다.");
    error.status = 400;
    throw error;
  }

  const [result] = await pool.execute(
    `INSERT INTO disease_encyclopedia
     (name, category, description, symptoms, treatment, image_url, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())`,
    [
      name,
      category,
      description,
      symptoms || null,
      treatment || null,
      image_url || null,
    ],
  );

  return new Disease({
    disease_id: result.insertId,
    name,
    category,
    description,
    symptoms: symptoms || null,
    treatment: treatment || null,
    image_url: image_url || null,
  });
};

exports.updateDisease = async (diseaseId, payload) => {
  const { name, category, description, symptoms, treatment, image_url } =
    payload;
  if (
    !name &&
    !category &&
    !description &&
    !symptoms &&
    !treatment &&
    !image_url
  ) {
    const error = new Error("수정할 데이터를 하나 이상 입력해야 합니다.");
    error.status = 400;
    throw error;
  }

  const fields = [];
  const params = [];

  if (name !== undefined) {
    fields.push("name = ?");
    params.push(name);
  }
  if (category !== undefined) {
    fields.push("category = ?");
    params.push(category);
  }
  if (description !== undefined) {
    fields.push("description = ?");
    params.push(description);
  }
  if (symptoms !== undefined) {
    fields.push("symptoms = ?");
    params.push(symptoms);
  }
  if (treatment !== undefined) {
    fields.push("treatment = ?");
    params.push(treatment);
  }
  if (image_url !== undefined) {
    fields.push("image_url = ?");
    params.push(image_url);
  }

  if (fields.length === 0) {
    const error = new Error("업데이트할 필드를 하나 이상 지정해야 합니다.");
    error.status = 400;
    throw error;
  }

  params.push(diseaseId);
  await pool.execute(
    `UPDATE disease_encyclopedia SET ${fields.join(", ")} , updated_at = NOW() WHERE disease_id = ?`,
    params,
  );

  return exports.getDiseaseById(diseaseId);
};
