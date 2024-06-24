const CustomError = require("../utils/CustomError");

const errorHandler = (err, req, res, next) => {
  if (err instanceof CustomError) {
    res.status(err.status).json({
      message: err.message,
    });
  } else {
    res.status(500).json("Internal Server Error");
  }
};

module.exports = errorHandler;
