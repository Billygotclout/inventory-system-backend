const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ["maker", "checker", "admin"],
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["active", "disabled"],
      default: "active",
    },
    rememberToken: {
      type: String,
    },
    resetPasswordToken: {
      type: String,
    },
    resetPasswordExpires: {
      type: Date,
    },
  },
  { timestamps: true }
);
userSchema.set("toJSON", {
  transform: function (doc, ret) {
    delete ret.password;
    delete ret.resetPasswordToken;
    delete ret.resetPasswordExpires;
    delete ret.rememberToken;
  },
});

module.exports = mongoose.model("User", userSchema);
