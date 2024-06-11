const userRepository = require("../data/user.repository");
const CustomError = require("../utils/CustomError");
const bcrypt = require("bcryptjs");

exports.createUser = async ({ email, password, role }) => {
  const user = await userRepository.getByEmail(email);
  if (user) {
    throw new CustomError("User already exists, please log in", 400);
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const newUser = await userRepository.create({
    email: email,
    password: hashPassword,
    role: role,
  });

  return newUser;
};
exports.toggleUserIsActiveType = async ({ id, status }) => {
  const user = await userRepository.get(id);

  if (!user) {
    throw new CustomError("User with that id not found", 404);
  }
  const approvedUser = await userRepository.update(id, {
    status: status,
  });

  return approvedUser;
};
exports.getAllUsers = async () => {
  const users = await userRepository.getAll();

  return users;
};
