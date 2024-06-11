const User = require("../models/User");
const CustomError = require("../utils/CustomError");

const isUserActive = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (user.status === "disabled") {
      throw new CustomError(
        "Your account has been disabled. Please contact your administrator for access permissions.",
        403
      );
    }
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = isUserActive;
