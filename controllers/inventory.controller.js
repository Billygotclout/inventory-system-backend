const inventoryService = require("../services/inventory.service");
const inventoryRepository = require("../data/inventory.repository");
const CustomError = require("../utils/CustomError");
const sendMail = require("../utils/sendMail");
const logger = require("../utils/logger");
const toggleInventoryType = async (req, res, next) => {
  try {
    const updateInventoryTypeStatus = await inventoryService.toggleIsActiveType(
      {
        category: req.body.category,
        isActive: req.body.isActive,
      }
    );
    if (!updateInventoryTypeStatus) {
      throw new CustomError(
        `Error updating inventory type to ${req.body.isActive}`,
        400
      );
    }
    return res.json({
      message: "Inventory type status updated",
      data: updateInventoryTypeStatus,
    });
  } catch (error) {
    next(error);
    logger.error(error.message);
  }
};
const approveInventory = async (req, res, next) => {
  try {
    const inventory =
      await inventoryService.aprroveSingleInventoryDataInsertion(req.params.id);

    return res.json({
      message: "File successfully approved",
      product: inventory,
    });
  } catch (error) {
    next(error);
    logger.error(error.message);
  }
};
const getAllInventoryItems = async (req, res, next) => {
  try {
    const getAllInventory = await inventoryService.getAllInventoryData();

    return res.json({
      message: "Inventory items fetched",
      data: getAllInventory,
    });
  } catch (error) {
    next(error);
    logger.error(error.message);
  }
};
const getInventoryItem = async (req, res, next) => {
  try {
    const getInventory = await inventoryService.viewInventory(req.params.id);

    return res.json({
      message: "Inventory item fetched",
      data: getInventory,
    });
  } catch (error) {
    next(error);
    logger.error(error.message);
  }
};
const createNewInventory = async (req, res, next) => {
  try {
    const createNew = await inventoryService.createInventory({
      serialNumber: req.body.serialNumber,
      model: req.body.model,
      purchaseDate: req.body.purchaseDate,
      deliveryDate: req.body.deliveryDate,
      color: req.body.color,
      costPerUnit: req.body.costPerUnit,
      user_id: req.user.id,
      quantity: req.body.quantity,
      status: "pending",
      category: req.body.category || null,
    });
    await sendMail({
      email: "",
      subject: "Request for approval",
      text: "Please ",
    });
    return res.json({
      message: "Inventory item successfully created",
      data: createNew,
    });
  } catch (error) {
    next(error);
    logger.error(error.message);
  }
};
const searchInventoryItems = async (req, res, next) => {
  try {
    const searchItems = await inventoryRepository.searchItems(req.query.term);
    res.json({
      message: "successfully fetched",
      items: searchItems,
    });
  } catch (error) {
    next(error);
    logger.error(error.message);
  }
};
module.exports = {
  toggleInventoryType,
  createNewInventory,
  getAllInventoryItems,
  getInventoryItem,
  approveInventory,
  searchInventoryItems,
};
