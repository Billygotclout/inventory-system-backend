const express = require("express");
const cors = require("cors");
const dbConnect = require("./config/dbConnect.config");
const path = require("path");
const fs = require("fs");
const userRepository = require("./data/user.repository");
const errorHandler = require("./middleware/errorHandler");
const logger = require("./utils/logger");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 3001;

dbConnect();
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    optionsSuccessStatus: 200,
  })
);
const logsDir = path.join(__dirname, "logs");
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}
const paymentUploadsDir = path.join(__dirname, "uploads/payments");
if (!fs.existsSync(paymentUploadsDir)) {
  fs.mkdirSync(paymentUploadsDir);
}

app.use("/uploads", express.static(uploadsDir));
app.use("/uploads/payments", express.static(paymentUploadsDir));

app.get("/", (req, res) => {
  res.send("API is running");
});
app.use("/api/auth", require("./routes/user.routes"));
app.use("/api/file", require("./routes/file.routes"));
app.use("/api/inventory", require("./routes/inventory.routes"));
app.use("/api/checker", require("./routes/checker.routes"));
app.use("/api/stockout", require("./routes/stockout.routes"));
app.use("/api/report", require("./routes/report.routes"));
app.use(errorHandler);
app.listen(port, () => {
  logger.info(`Server is listening on http://localhost:${port}`);
});
