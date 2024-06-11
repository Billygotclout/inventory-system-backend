const Inventory = require("../models/Inventory");
const CustomError = require("../utils/CustomError");
const inventoryRepository = require("../data/inventory.repository");

exports.toggleIsActiveType = async ({ category, isActive }) => {
  const inventories = await Inventory.find({ category: category });

  if (inventories.length === 0) {
    throw new CustomError("Inventory type not found", 404);
  }

  const updatedInventories = await Promise.all(
    inventories.map(async (inventory) => {
      inventory.active = isActive;
      await inventory.save();
      return inventory;
    })
  );

  return updatedInventories;
};
exports.getAllInventoryData = async () => {
  const inventories = await inventoryRepository.getwhere({
    status: "approved",
  });
  return inventories;
};
exports.createInventory = async (payload) => {
  const inventories = await Inventory.findOne({
    serialNumber: payload.serialNumber,
  });

  if (inventories && inventories !== undefined) {
    throw new CustomError(
      "Inventory with that serial number already exists in db",
      400
    );
  } else {
    const newInventory = await Inventory.create(payload);
    if (!newInventory) {
      throw new CustomError("Error creating inventory", 404);
    }
    return newInventory;
  }
};
exports.viewInventory = async (id) => {
  const inventory = await inventoryRepository.get(id);
  if (!inventory) {
    throw new CustomError("Inventory with that id not found", 404);
  }

  return inventory;
};
exports.aprroveSingleInventoryDataInsertion = async (id) => {
  const inventory = await inventoryRepository.get(id);
  if (!inventory) {
    throw new CustomError("Inventory with that id not found", 404);
  }

  const approvedInventory = await inventoryRepository.update(id, {
    status: "approved",
  });

  return approvedInventory;
};
