const authService = require("../../application/authService");

const extractToken = (req) => {
  const authHeader =
    req.headers.authorization || req.body.token || req.query.token;
  if (!authHeader || typeof authHeader !== "string") return null;
  if (authHeader.startsWith("Bearer ")) {
    return authHeader.slice(7).trim();
  }
  return authHeader.trim();
};

exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);

    return res.status(200).json({
      success: true,
      message: "관리자 로그인 성공",
      token: result.token,
      role: result.role,
    });
  } catch (error) {
    return res.status(error.status || 500).json({
      success: false,
      message: error.message || "서버 오류로 로그인에 실패했습니다.",
    });
  }
};

exports.adminLogout = async (req, res) => {
  try {
    const token = extractToken(req);
    if (!token) {
      return res.status(400).json({
        success: false,
        message: "JWT 토큰이 필요합니다.",
      });
    }

    authService.logout(token);
    return res.status(200).json({
      success: true,
      message: "관리자 로그아웃 성공",
    });
  } catch (error) {
    return res.status(error.status || 500).json({
      success: false,
      message: error.message || "서버 오류로 로그아웃에 실패했습니다.",
    });
  }
};
