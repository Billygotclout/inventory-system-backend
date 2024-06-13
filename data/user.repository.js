const User = require("../models/User");
const CustomError = require("../utils/CustomError");

exports.get = async (id) => {
  const existingUser = await User.findOne({ _id: id });
  if (!existingUser) {
    throw new CustomError("User not found", 404);
  }
  return existingUser;
};
exports.getOne = async (payload) => {
  const existingUser = await User.findOne(payload);

  return existingUser;
};
exports.getByEmail = async (email) => {
  const existingUser = await User.findOne({ email: email });
  if (!existingUser) {
    throw new CustomError("User not found", 404);
  }
  return existingUser;
};

exports.getAll = async () => {
  return await User.find();
};
exports.getCount = async () => {
  return User.countDocuments({});
};

exports.create = async (payload) => {
  try {
    const newUser = await User.create(payload);
    if (!newUser) {
      throw new CustomError("Error creating user", 400);
    }
    return newUser;
  } catch (error) {
    throw error;
  }
};
exports.update = async (id, updatedUser) => {
  try {
    const updatedUserDetails = await User.findOneAndUpdate(
      { _id: id },
      updatedUser
    );

    return updatedUserDetails;
  } catch (err) {
    throw err;
  }
};

// A method for deleting one user instance
exports.deleteOne = async (id) => {
  try {
    await User.deleteOne({ _id: id });
  } catch (err) {
    throw err;
  }
};
