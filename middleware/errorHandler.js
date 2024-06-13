const CustomError = require("../utils/CustomError");

const errorHandler = (err, req, res, next) => {
  if (err instanceof CustomError) {
    // Handle specific custom errors
    res.status(err.status).json({
      error: {
        message: err.message,
        status: err.status,
      },
    });
  } else {
    // Handle other types of errors (or fallback)
    res.status(500).json({
      error: {
        message: "Internal server error",
      },
    });
  }
};

module.exports = errorHandler;
