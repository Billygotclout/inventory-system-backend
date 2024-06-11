const mongoose = require("mongoose");

const dbConnect = async () => {
  const connect = await mongoose.connect(process.env.MONGODB_URI);

  console.log(
    "Db connected: ",
    connect.connection.host,
    connect.connection.name
  );
};

module.exports = dbConnect;
