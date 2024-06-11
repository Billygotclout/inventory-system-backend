const checkerService = require("../services/checker.service");

const createUserDetails = async (req, res, next) => {
  try {
    const createUserDetails = await checkerService.createUser({
      email: req.body.email,
      password: req.body.password,
      role: req.body.role,
    });
    return res.json({
      message: "User successfully created",
      data: createUserDetails,
    });
  } catch (error) {
    next(error);
  }
};
const toggleUserStatus = async (req, res, next) => {
  try {
    const user = await checkerService.toggleUserIsActiveType({
      id: req.params.id,
      status: req.body.status,
    });

    return res.json({
      message: "User status successfully updated",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};
const getAll = async (req, res, next) => {
  try {
    const users = await checkerService.getAllUsers();

    return res.json({
      message: "users",
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { createUserDetails, toggleUserStatus, getAll };
