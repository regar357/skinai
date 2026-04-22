const jwt = require("jsonwebtoken");

const { env } = require("../config/env");

function extractUserId(payload) {
  return payload?.sub ?? payload?.userId ?? payload?.id ?? null;
}

function verifyJwt(req, res, next) {
  const authorization = req.headers.authorization;

  if (!authorization?.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      error: {
        code: "UNAUTHORIZED",
        message: "Bearer token is required.",
      },
    });
  }

  const token = authorization.slice(7);

  try {
    const payload = jwt.verify(token, env.jwtSecret, {
      algorithms: env.jwtAlgorithms,
    });

    const userId = extractUserId(payload);

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: {
          code: "UNAUTHORIZED",
          message: "Token payload does not contain a valid user identifier.",
        },
      });
    }

    req.user = {
      id: String(userId),
      payload,
    };

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
}

module.exports = {
  verifyJwt,
};
