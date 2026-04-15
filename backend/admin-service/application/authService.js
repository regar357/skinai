const pool = require("../infrastructure/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Admin } = require("../domain/models/Admin");

const JWT_SECRET = process.env.JWT_SECRET || "1234";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "2h";
const blacklistedTokens = new Set();

const findAdminByEmail = async (email) => {
  const [rows] = await pool.execute(
    "SELECT admin_id, email, password, role, created_at FROM admins WHERE email = ? LIMIT 1",
    [email],
  );

  const row = rows[0];
  if (!row) return null;
  return new Admin({
    adminId: row.admin_id,
    email: row.email,
    password: row.password,
    role: row.role,
    createdAt: row.created_at,
  });
};

exports.login = async (email, password) => {
  if (!email || !password) {
    const error = new Error("관리자 이메일과 비밀번호를 모두 입력해주세요.");
    error.status = 400;
    throw error;
  }

  const admin = await findAdminByEmail(email);
  if (!admin) {
    const error = new Error(
      "로그인 실패: 관리자 계정 정보를 찾을 수 없습니다.",
    );
    error.status = 401;
    throw error;
  }

  const passwordMatch = await bcrypt.compare(password, admin.password);
  if (!passwordMatch) {
    const error = new Error("로그인 실패: 비밀번호가 올바르지 않습니다.");
    error.status = 401;
    throw error;
  }

  const tokenPayload = {
    adminId: admin.adminId,
    email: admin.email,
    role: admin.role || "admin",
  };

  const token = jwt.sign(tokenPayload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });

  return {
    token,
    role: tokenPayload.role,
  };
};

exports.logout = (token) => {
  if (!token) {
    const error = new Error("JWT 토큰이 필요합니다.");
    error.status = 400;
    throw error;
  }

  try {
    jwt.verify(token, JWT_SECRET);
  } catch (verifyError) {
    const error = new Error("유효하지 않은 토큰입니다.");
    error.status = 400;
    throw error;
  }

  blacklistedTokens.add(token);
};

exports.isTokenBlacklisted = (token) => blacklistedTokens.has(token);
