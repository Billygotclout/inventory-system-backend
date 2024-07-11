const User = require("../models/User");
const CustomError = require("../utils/CustomError");
const logger = require("../utils/logger");

const isUserActive = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      throw new CustomError("User not found", 404);
    }
    if (user.status === "disabled") {
      throw new CustomError(
        "Your account has been disabled. Please contact your administrator for access permissions.",
        403
      );
    }
    req.user = user;
    next();
  } catch (error) {
    if (error instanceof CustomError) {
      next(error);
      logger.error(error.message);
    }
  }
};

module.exports = isUserActive;
