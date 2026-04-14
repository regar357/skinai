const pool = require("../config/db");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "1234";

//토큰 추출 함수
const extractToken = (req) => {
  const authHeader =
    req.headers.authorization || req.body.token || req.query.token;
  if (!authHeader || typeof authHeader !== "string") return null;
  if (authHeader.startsWith("Bearer ")) {
    return authHeader.slice(7).trim();
  }
  return authHeader.trim();
};

//피부종양 백과사전 조회
exports.getDiseases = async (req, res) => {
  try {
    const token = extractToken(req);
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "JWT 토큰이 필요합니다." });
    }

    try {
      jwt.verify(token, JWT_SECRET);
    } catch (error) {
      return res
        .status(401)
        .json({ success: false, message: "유효하지 않은 JWT 토큰입니다." });
    }

    const category = req.query.category || req.body.category || "";
    const keyword = req.query.keyword || req.body.keyword || "";

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

    return res.status(200).json({
      success: true,
      message: "백과자료 조회 성공",
      data: rows,
    });
  } catch (error) {
    console.error("getDiseases error", error);
    return res.status(500).json({
      success: false,
      message: "서버 오류로 백과자료를 조회할 수 없습니다.",
    });
  }
};
//피부종양 백과사전 상세조회
exports.getDiseases_id = async (req, res) => {
  try {
    const token = extractToken(req);
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "JWT 토큰이 필요합니다." });
    }

    try {
      jwt.verify(token, JWT_SECRET);
    } catch (error) {
      return res
        .status(401)
        .json({ success: false, message: "유효하지 않은 JWT 토큰입니다." });
    }

    const diseaseId =
      req.params.disease_id || req.body.disease_id || req.query.disease_id;
    if (!diseaseId) {
      return res
        .status(400)
        .json({ success: false, message: "자료 ID가 필요합니다." });
    }

    const [rows] = await pool.execute(
      `SELECT disease_id, name, category, description, symptoms, treatment, image_url, created_at, updated_at
       FROM disease_encyclopedia
       WHERE disease_id = ?`,
      [diseaseId],
    );

    const disease = rows[0];
    if (!disease) {
      return res.status(404).json({
        success: false,
        message: "요청하신 백과사전 자료를 찾을 수 없습니다.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "백과자료 상세조회 성공",
      data: disease,
    });
  } catch (error) {
    console.error("getDiseases_id error", error);
    return res.status(500).json({
      success: false,
      message: "서버 오류로 백과자료 상세조회에 실패했습니다.",
    });
  }
};
//피부종양 백과사전 생성
exports.createDiseases = async (req, res) => {
  try {
    const token = extractToken(req);
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "JWT 토큰이 필요합니다." });
    }

    try {
      jwt.verify(token, JWT_SECRET);
    } catch (error) {
      return res
        .status(401)
        .json({ success: false, message: "유효하지 않은 JWT 토큰입니다." });
    }

    const { name, category, description, symptoms, treatment, image_url } =
      req.body;
    if (!name || !category || !description) {
      return res.status(400).json({
        success: false,
        message: "name, category, description 항목은 필수입니다.",
      });
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

    return res.status(201).json({
      success: true,
      message: "백과자료 생성 성공",
      data: {
        disease_id: result.insertId,
        name,
        category,
        description,
        symptoms: symptoms || null,
        treatment: treatment || null,
        image_url: image_url || null,
      },
    });
  } catch (error) {
    console.error("createDiseases error", error);
    return res.status(500).json({
      success: false,
      message: "서버 오류로 백과자료 생성에 실패했습니다.",
    });
  }
};
//피부종양 백과사전 수정
exports.updateDiseases = async (req, res) => {
  try {
    const token = extractToken(req);
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "JWT 토큰이 필요합니다." });
    }

    try {
      jwt.verify(token, JWT_SECRET);
    } catch (error) {
      return res
        .status(401)
        .json({ success: false, message: "유효하지 않은 JWT 토큰입니다." });
    }

    const diseaseId =
      req.params.disease_id || req.body.disease_id || req.query.disease_id;
    if (!diseaseId) {
      return res
        .status(400)
        .json({ success: false, message: "자료 ID가 필요합니다." });
    }

    const { name, category, description, symptoms, treatment, image_url } =
      req.body;

    const updates = [];
    const params = [];

    if (name) {
      updates.push("name = ?");
      params.push(name);
    }
    if (category) {
      updates.push("category = ?");
      params.push(category);
    }
    if (description) {
      updates.push("description = ?");
      params.push(description);
    }
    if (symptoms !== undefined) {
      updates.push("symptoms = ?");
      params.push(symptoms);
    }
    if (treatment !== undefined) {
      updates.push("treatment = ?");
      params.push(treatment);
    }
    if (image_url !== undefined) {
      updates.push("image_url = ?");
      params.push(image_url);
    }

    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        message: "수정할 항목을 하나 이상 전달해야 합니다.",
      });
    }

    updates.push("updated_at = NOW()");
    const sql = `UPDATE disease_encyclopedia SET ${updates.join(", ")} WHERE disease_id = ?`;
    params.push(diseaseId);

    const [result] = await pool.execute(sql, params);
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "수정할 백과자료를 찾을 수 없습니다.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "백과자료 수정 성공",
      data: {
        disease_id: diseaseId,
        ...(name && { name }),
        ...(category && { category }),
        ...(description && { description }),
        ...(symptoms !== undefined && { symptoms }),
        ...(treatment !== undefined && { treatment }),
        ...(image_url !== undefined && { image_url }),
      },
    });
  } catch (error) {
    console.error("updateDiseases error", error);
    return res.status(500).json({
      success: false,
      message: "서버 오류로 백과자료 수정에 실패했습니다.",
    });
  }
};
