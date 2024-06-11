const express = require("express");

const validateToken = require("../middleware/validateToken");
const roleChecker = require("../middleware/roleChecker");
const {
  createUserDetails,
  toggleUserStatus,
  getAll,
} = require("../controllers/checker.controller");

const router = express.Router();
router.use(validateToken, roleChecker("checker"));
router.route("/create-user").post(createUserDetails);
router.route("/toggle-status/:id").put(toggleUserStatus);
router.route("/get-users").get(getAll);
module.exports = router;
