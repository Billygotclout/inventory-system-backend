const express = require("express");
const {
  issueRequester,
  viewRequesterInfo,
  approveStockOut,
  rejectStockOut,
  getAllRequests,
} = require("../controllers/stockout.controller");

const validateToken = require("../middleware/validateToken");
const roleChecker = require("../middleware/roleChecker");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const CustomError = require("../utils/CustomError");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads/payments"));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png" && ext !== ".pdf") {
    return cb(new CustomError("Unsupported file type", 400), false);
  }
  cb(null, true);
};

const upload = multer({
  fileFilter: fileFilter,
  storage: storage,
});

module.exports = upload;
router.use(validateToken);
router.post(
  "/issue",
  roleChecker("maker"),
  upload.single("file"),
  issueRequester
);
router.get("/requesters", getAllRequests);
router.get("/view/:id", viewRequesterInfo);
router.use(roleChecker("checker"));

router.put("/stock-out", approveStockOut);
router.put("/reject-stock-out", rejectStockOut);

module.exports = router;
