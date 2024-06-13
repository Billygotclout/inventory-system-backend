const express = require("express");
const cors = require("cors");
const dbConnect = require("./config/dbConnect.config");
const path = require("path");
const userRepository = require("./data/user.repository");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 3001;

dbConnect();
app.use(express.json());
app.use(cors());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.get("/", (req, res) => {
  res.send("API is running");
});
app.use("/api/auth", require("./routes/user.routes"));
app.use("/api/file", require("./routes/file.routes"));
app.use("/api/inventory", require("./routes/inventory.routes"));
app.use("/api/checker", require("./routes/checker.routes"));
app.listen(port, () => {
  console.log(`Server is listening on http://localhost:${port}`);
});
