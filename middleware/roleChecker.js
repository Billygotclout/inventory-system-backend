const User = require("../models/User");
const CustomError = require("../utils/CustomError");
const logger = require("../utils/logger");

// check user role and grant access
const roleChecker = (roles) => async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!roles.includes(user.role)) {
      throw new CustomError(
        "Please contact your administrator for access permissions.",
        403
      );
    }
    next();
  } catch (error) {
    if (error instanceof CustomError) {
      next(error);
      logger.error(error.message);
    }
  }
};

module.exports = roleChecker;
