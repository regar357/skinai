function errorHandler(err, req, res, next) {
  const status = err.status || 500;
  const body = {
    message: err.message || "Internal Server Error",
  };

  res.status(status).json({
    status,
    headers: {
      "Content-Type": "application/json",
    },
    body,
  });
}

module.exports = { errorHandler };
