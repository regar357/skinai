const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "graduation-project-secret";

const extractToken = (req) => {
  const authHeader =
    req.headers.authorization || req.body.token || req.query.token;
  if (!authHeader || typeof authHeader !== "string") {
    return null;
  }
  if (authHeader.startsWith("Bearer ")) {
    return authHeader.slice(7).trim();
  }
  return authHeader.trim();
};

exports.requireAuth = (req, res, next) => {
  const token = extractToken(req);

  if (!token) {
    return res.status(401).json({
      success: false,
      error: {
        code: "UNAUTHORIZED",
        message: "Bearer token is required.",
      },
    });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    return next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: {
        code: "UNAUTHORIZED",
        message: "Invalid or expired token.",
      },
    });
  }
};
