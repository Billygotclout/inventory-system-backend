const jwt = require("jsonwebtoken");
const CustomError = require("../utils/CustomError");
const logger = require("../utils/logger");

const validateToken = async (req, res, next) => {
  try {
    let token;
    let authHeaders = req.headers.Authorization || req.headers.authorization;
    if (authHeaders && authHeaders.startsWith("Bearer")) {
      token = authHeaders.split(" ")[1];
      jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
        if (err) {
          throw new CustomError("User is not authorized ", 401);
        }
        req.user = decoded.user;
        next();
      });
      if (!token) {
        throw new CustomError("User is not authorized ", 401);
      }
    } else {
      throw new CustomError("Please insert Token ", 400);
    }
  } catch (error) {
    if (error instanceof CustomError) {
      next(error);
      logger.error(error.message);
    }
  }
};

module.exports = validateToken;
