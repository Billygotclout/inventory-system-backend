const multer = require("multer");
const path = require("path");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads"));
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

const upload = multer({
  fileFilter: fileFilter,
  storage: storage,
});

module.exports = upload;
