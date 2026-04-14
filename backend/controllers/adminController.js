const pool = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "1234";
const JWT_EXPIRES_IN = "2h"; //토큰 유효 기간
const blacklistedTokens = new Set(); //이미 사용된 토큰 보관

//req.headers.authorization, req.body.token, req.query.token에서 JWT토큰 추출
const extractToken = (req) => {
  const authHeader =
    req.headers.authorization || req.body.token || req.query.token;
  if (!authHeader) return null;
  if (typeof authHeader !== "string") return null;
  if (authHeader.startsWith("Bearer ")) {
    return authHeader.slice(7).trim();
  }
  return authHeader.trim();
};

//다른 곳에서 블랙리스트 검사 로직 재사용 할 수 있음
exports.isBlacklistedToken = (token) => blacklistedTokens.has(token);

//관리자 로그인
exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "관리자 이메일과 비밀번호를 모두 입력해주세요.",
      });
    }

    const [rows] = await pool.execute(
      "SELECT admin_id, email, password, role FROM admins WHERE email = ? LIMIT 1",
      [email],
    );

    const admin = rows[0];
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "로그인 실패: 관리자 계정 정보를 찾을 수 없습니다.",
      });
    }

    const passwordMatch = await bcrypt.compare(password, admin.password);
    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "로그인 실패: 비밀번호가 올바르지 않습니다.",
      });
    }

    const tokenPayload = {
      adminId: admin.admin_id,
      email: admin.email,
      role: admin.role || "admin",
    };

    const token = jwt.sign(tokenPayload, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    return res.status(200).json({
      success: true,
      message: "관리자 로그인 성공",
      token,
      role: tokenPayload.role,
    });
  } catch (error) {
    console.error("adminLogin error", error);
    return res.status(500).json({
      success: false,
      message: "서버 오류로 로그인에 실패했습니다.",
    });
  }
};

//관리자 로그아웃
exports.adminLogout = async (req, res) => {
  try {
    const token = extractToken(req);
    if (!token) {
      return res.status(400).json({
        success: false,
        message: "JWT 토큰이 필요합니다.",
      });
    }

    try {
      jwt.verify(token, JWT_SECRET);
    } catch (verifyError) {
      return res.status(400).json({
        success: false,
        message: "유효하지 않은 토큰입니다.",
      });
    }

    if (blacklistedTokens.has(token)) {
      return res.status(200).json({
        success: true,
        message: "이미 로그아웃된 토큰입니다.",
      });
    }

    blacklistedTokens.add(token);

    return res.status(200).json({
      success: true,
      message: "관리자 로그아웃 성공",
    });
  } catch (error) {
    console.error("adminLogout error", error);
    return res.status(500).json({
      success: false,
      message: "서버 오류로 로그아웃에 실패했습니다.",
    });
  }
};
