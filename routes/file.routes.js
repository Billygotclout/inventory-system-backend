const express = require("express");

const validateToken = require("../middleware/validateToken");
const roleChecker = require("../middleware/roleChecker");
const {
  uploadFileForApproval,
  checkUploadedFile,
  saveApprovedDataToDatabase,
  cancelDataRequest,
} = require("../controllers/file.controller");

const CustomError = require("../utils/CustomError");
const upload = require("../config/upload.config");
const router = express.Router();

router.use(validateToken);

router
  .route("/import")
  .post(roleChecker("maker"), upload.single("file"), uploadFileForApproval);
router.route("/check-file/:id").get(roleChecker("checker"), checkUploadedFile);
router
  .route("/save-file/:id")
  .post(roleChecker("checker"), saveApprovedDataToDatabase);
router
  .route("/cancel-file/:id")
  .delete(roleChecker("checker"), cancelDataRequest);
module.exports = router;
