function notFoundHandler(req, res) {
  res.status(404).json({
    success: false,
    error: {
      code: "NOT_FOUND",
      message: "Requested resource was not found.",
    },
  });
}

function errorHandler(error, req, res, next) {
  const statusCode = error.statusCode ?? 500;
  const errorCode = statusCode === 500 ? "INTERNAL_ERROR" : "REQUEST_FAILED";

  if (statusCode >= 500) {
    console.error(error);
  }

  res.status(statusCode).json({
    success: false,
    error: {
      code: error.code ?? errorCode,
      message: error.message ?? "Unexpected server error.",
      details: error.details,
    },
  });
}

module.exports = {
  errorHandler,
  notFoundHandler,
};
