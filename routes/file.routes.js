const express = require("express");
const multer = require("multer");
const validateToken = require("../middleware/validateToken");
const roleChecker = require("../middleware/roleChecker");
const {
  uploadFileForApproval,
  checkUploadedFile,
  saveApprovedDataToDatabase,
  cancelDataRequest,
} = require("../controllers/file.controller");
const path = require("path");
const CustomError = require("../utils/CustomError");
const router = express.Router();
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads/"));
  },

  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (ext !== ".xls" && ext !== ".xlsx" && ext !== ".csv") {
    return cb(new CustomError("Unsupported file type", 400), false);
  }
  cb(null, true);
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

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
