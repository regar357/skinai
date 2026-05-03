function errorHandler(error, req, res, next) {
  if (res.headersSent) return next(error);

  if (error.code === "LIMIT_FILE_SIZE") {
    return res.status(413).json({
      error: {
        code: "ImageTooLarge",
        message: "Image file is too large."
      }
    });
  }

  res.status(error.statusCode || 500).json({
    error: {
      code: error.code || "InternalServerError",
      message: error.message || "Internal server error."
    }
  });
}

module.exports = { errorHandler };
