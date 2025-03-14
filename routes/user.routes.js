const express = require("express");
const {
  loginUser,
  forgotPassword,
  resetPassword,
  currentUser,
} = require("../controllers/user.controller");
const validateToken = require("../middleware/validateToken");
const isUserActive = require("../middleware/isUserActive");

const router = express.Router();
router.route("/current-user").get(validateToken, currentUser);
router.use(isUserActive);
router.route("/login").post(loginUser);
router.route("/forgot-password").post(forgotPassword);
router.route("/reset-password/:token").post(resetPassword);

module.exports = router;
