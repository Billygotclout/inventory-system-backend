const CustomError = require("../utils/CustomError");

const errorHandler = (err, req, res, next) => {
  // Set default error values if not provided
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  // Send error response
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    // Include the stack trace only in development mode
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

module.exports = errorHandler;
