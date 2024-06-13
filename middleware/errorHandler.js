const CustomError = require("../utils/CustomError");

const errorHandler = (err, req, res, next) => {
  console.error(err.stack); // Log the error stack trace

  // If the error is an instance of CustomError, use its status and message
  if (err instanceof CustomError) {
    res.status(err.statusCode()).send({
      error: err.errorMessage(),
    });
  } else {
    // Handle generic errors
    res.status(err.status || 500).send({
      error: "Something went wrong!",
    });
  }
};

module.exports = errorHandler;
