const express = require("express");

const validateToken = require("../middleware/validateToken");

const roleChecker = require("../middleware/roleChecker");
const generateReport = require("../controllers/report.controller");

const router = express.Router();
router.use(validateToken);
router.route("/generate").get(generateReport);
module.exports = router;
