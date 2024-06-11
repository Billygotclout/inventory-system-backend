const userService = require("../services/user.service");
const jwt = require("jsonwebtoken");

require("dotenv").config();
const CustomError = require("../utils/CustomError");
const sendMail = require("../utils/sendMail");
const User = require("../models/User");
const loginUser = async (req, res, next) => {
  const { email, password, rememberMe } = req.body;
  try {
    const user = await userService.login({
      email: email,
      password: password,
    });

    if (!user) {
      throw new CustomError("Error logging in user", 400);
    }
    const token = jwt.sign(
      {
        user: {
          email: user.email,
          id: user.id,
          role: user.role,
        },
      },
      process.env.TOKEN_SECRET
    );
    if (rememberMe) {
      const rememberToken = jwt.sign(
        {
          user: {
            email: user.email,
            id: user.id,
            role: user.role,
          },
        },
        process.env.TOKEN_SECRET,
        {
          expiresIn: "30d",
        }
      );
      user.rememberToken = rememberToken;
      await user.save();
    } else {
      user.rememberToken = "";
    }
    await user.save();
    return res.json({
      message: "User logged in successfully",
      token: token,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};
const forgotPassword = async (req, res, next) => {
  try {
    const forgotPasswordToken = await userService.passwordRecovery({
      email: req.body.email,
    });
    await sendMail({
      email: req.body.email,
      subject: "Password Reset",
      text:
        `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n` +
        `Please click on the following link, or paste this into your browser to complete the process:\n\n` +
        `http://localhost:3000/api/auth/reset-password/${forgotPasswordToken}\n\n` +
        `If you did not request this, please ignore this email and your password will remain unchanged.\n`,
    });
    return res.json({
      message: "Please check your email for our password recovery email",
    });
  } catch (error) {
    next(error);
  }
};
const resetPassword = async (req, res, next) => {
  try {
    await userService.passwordChange({
      token: req.params.token,
      password: req.body.password,
    });

    // If no error was thrown, it means the password change was successful
    return res.json({
      message: "Password successfully reset",
    });
  } catch (error) {
    next(error);
  }
};

const currentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      throw new CustomError("User not found", 404);
    }
    return res.json({
      message: "user fetched",
      user: user,
    });
  } catch (error) {
    next(error);
  }
};
module.exports = { loginUser, forgotPassword, resetPassword, currentUser };
