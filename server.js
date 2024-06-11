const express = require("express");
const cors = require("cors");
const dbConnect = require("./config/dbConnect.config");
const userRepository = require("./data/user.repository");

const app = express();
const port = process.env.PORT || 30001;

dbConnect();
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send(userRepository.getCount().then((cc) => console.log(cc)));
});
app.use("/api/auth", require("./routes/user.routes"));
app.use("/api/file", require("./routes/file.routes"));
app.use("/api/inventory", require("./routes/inventory.routes"));
app.use("/api/checker", require("./routes/checker.routes"));
app.listen(port, () => {
  console.log(`Server is listening on http://localhost:${port}`);
});
