const Inventory = require("../models/Inventory");
const Requester = require("../models/Requester");
const CustomError = require("../utils/CustomError");
const stockoutService = require("../services/stockout.service");
const fs = require("fs");
const logger = require("../utils/logger");
const issueRequester = async (req, res, next) => {
  try {
    const { fullName, region, state, address, phone, purpose, items } =
      req.body;

    const requester = await stockoutService.issue({
      fullName,
      region,
      state,
      address,
      phone,
      items,
      purpose,
      paymentEvidencePath: req.file.filename,
      user_id: req.user.id,
    });
    res.status(201).json({
      message:
        "Request for issue out successfully created, checker will go through it",
      details: requester,
    });
  } catch (error) {
    next(error);
    logger.error(error.message);
  }
};
const viewRequesterInfo = async (req, res, next) => {
  try {
    const requesterId = req.params.id;
    const info = await stockoutService.viewRequesterInfoData(requesterId);
    res.status(200).json(info);
  } catch (error) {
    next(error);
    logger.error(error.message);
  }
};

const approveStockOut = async (req, res, next) => {
  try {
    const { items } = req.body;
    const result = await stockoutService.stockOut({ items });
    res.status(200).json(result);
  } catch (error) {
    next(error);
    logger.error(error.message);
  }
};
const rejectStockOut = async (req, res, next) => {
  try {
    const { items } = req.body;
    const result = await stockoutService.rejectStockOut({ items });
    res.status(200).json(result);
  } catch (error) {
    next(error);
    logger.error(error.message);
  }
};
module.exports = {
  issueRequester,
  viewRequesterInfo,
  approveStockOut,
  rejectStockOut,
};
