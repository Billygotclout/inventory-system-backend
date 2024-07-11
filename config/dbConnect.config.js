const mongoose = require("mongoose");
const logger = require("../utils/logger");
require("dotenv").config();
const dbConnect = async () => {
  const connect = await mongoose.connect(process.env.MONGODB_URI);

  logger.info(
    `Db connected: ${connect.connection.host} ${connect.connection.name}`
  );
  logger.error(error.message);
};

module.exports = dbConnect;
