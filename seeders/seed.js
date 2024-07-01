const mongoose = require("mongoose");
require("dotenv").config();
const User = require("../models/User");
const bcrpyt = require("bcryptjs");
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB", err);
  });

const generateRandomUsers = () => {
  const users = [
    {
      email: "williamsoluwademilade@gmail.com",
      password: bcrpyt.hashSync("vnp-1234", 10),
      role: "admin",
      status: "active",
      createdAt: new Date(Date.now() + 3600000),
      updatedAt: new Date(Date.now() + 3600000),
    },
    {
      email: "checker@checker.com",
      password: bcrpyt.hashSync("vnp-1234", 10),
      role: "checker",
      status: "active",
      createdAt: new Date(Date.now() + 3600000),
      updatedAt: new Date(Date.now() + 3600000),
    },
    {
      email: "maker@maker.com",
      password: bcrpyt.hashSync("vnp-1234", 10),
      role: "maker",
      status: "active",
      createdAt: new Date(Date.now() + 3600000),
      updatedAt: new Date(Date.now() + 3600000),
    },
    {
      email: "famakindeolamide@gmail.com",
      password: bcrpyt.hashSync("vnp-1234", 10),
      role: "checker",
      status: "active",
      createdAt: new Date(Date.now() + 3600000),
      updatedAt: new Date(Date.now() + 3600000),
    },
  ];
  return users;
};

const seedDB = async () => {
  try {
    const users = generateRandomUsers();

    await User.insertMany(users);
    console.log(`Database seeded with users!`);
  } catch (err) {
    console.error("Error seeding database", err);
  } finally {
    mongoose.connection.close();
  }
};
seedDB();
