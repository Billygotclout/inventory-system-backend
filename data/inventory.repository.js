const Inventory = require("../models/Inventory");
const CustomError = require("../utils/CustomError");

exports.get = async (id) => {
  const existingInventory = await Inventory.findOne({ _id: id });
  if (!existingInventory) {
    throw new CustomError("Inventory not found", 404);
  }
  return existingInventory;
};
exports.getOne = async (payload) => {
  const existingInventory = await Inventory.findOne(payload);

  return existingInventory;
};
exports.getByEmail = async (email) => {
  const existingInventory = await Inventory.findOne({ email: email });
  if (!existingInventory) {
    throw new CustomError("Inventory not found", 404);
  }
  return existingInventory;
};

exports.getAll = async () => {
  return await Inventory.find();
};
exports.getwhere = async (condition) => {
  return await Inventory.find(condition);
};
exports.getwhereOrWhere = async (conditions) => {
  const query = { $and: conditions };
  return await Inventory.find(query);
};
exports.getCount = async () => {
  return Inventory.countDocuments({});
};

exports.create = async (payload) => {
  try {
    const newInventory = await Inventory.create(payload);
    if (!newInventory) {
      throw new CustomError("Error creating Inventory", 400);
    }
    return newInventory;
  } catch (error) {
    throw error;
  }
};
exports.update = async (id, updatedInventory) => {
  try {
    const updatedInventoryDetails = await Inventory.findOneAndUpdate(
      { _id: id },
      updatedInventory
    );

    return updatedInventoryDetails;
  } catch (err) {
    throw err;
  }
};

// A method for deleting one user instance
exports.deleteOne = async (id) => {
  try {
    await Inventory.deleteOne({ _id: id });
  } catch (err) {
    throw err;
  }
};
exports.searchItems = async (term) => {
  try {
    if (!term) {
      throw new CustomError("Search term is required", 400);
    }
    const searchRegex = new RegExp(term, "i");

    const searchDate = isNaN(Date.parse(term)) ? null : new Date(term);
    const searchCost = isNaN(Number(term)) ? null : Number(term);

    const filter = {
      $or: [
        { category: searchRegex },
        { serialNumber: searchRegex },
        searchDate ? { purchaseDate: searchDate } : null,
        searchCost ? { costPerUnit: searchCost } : null,
      ].filter((condition) => condition !== null),
    };

    const items = await Inventory.find(filter);
    return items;
  } catch (error) {
    throw error;
  }
};
