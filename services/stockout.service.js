const Inventory = require("../models/Inventory");
const Requester = require("../models/Requester");
const CustomError = require("../utils/CustomError");
const mongoose = require("mongoose");

// Assuming you have a model named Requester

exports.issue = async ({
  fullName,
  region,
  state,
  address,
  phone,
  purpose,
  items,
  paymentEvidencePath,
  user_id: user_id,
}) => {
  let resultArray = items.split(/\s*,\s*/);

  await Promise.all(
    resultArray.map((item) => {
      new mongoose.Types.ObjectId(item);
    })
  );

  const requester = new Requester({
    fullName,
    region,
    state,
    address,
    phone,
    items: resultArray,
    purpose,
    paymentEvidence: paymentEvidencePath,
    user_id: user_id,
  });
  await requester.save();
  await requester.populate({
    path: "items",
    model: "Inventory",
  });

  return requester;
};

exports.getAllIssueOutRequests = async () => {
  const requestDetails = await Requester.find().populate({
    path: "items",
    model: "Inventory",
  });

  return requestDetails;
};

exports.viewRequesterInfoData = async (requesterId) => {
  try {
    const requester = await Requester.findById(requesterId).populate({
      path: "items",
      model: "Inventory",
    });
    if (!requester) {
      throw new CustomError("Requester not found", 404);
    }

    return requester;
  } catch (error) {
    throw new CustomError(
      error.message || "Failed to fetch requester information",
      error.status || 500
    );
  }
};
exports.stockOut = async ({ items }) => {
  const inventoryItems = await Inventory.updateMany(
    { _id: { $in: items } },
    { $set: { issuedOut: true } }
  );

  if (inventoryItems.modifiedCount === 0) {
    throw new CustomError("No items found or already issued", 404);
  }
  const allItemsRejected = inventoryItems.modifiedCount === items.length;

  if (allItemsRejected) {
    const firstItemId = items[0];
    const inventoryItem = await Inventory.findById(firstItemId);

    const requesterId = inventoryItem.user_id;
    await Requester.findOneAndUpdate(
      { user_id: requesterId },
      { status: "approved" }
    );
  }
  return inventoryItems;
};

exports.rejectStockOut = async ({ items }) => {
  const result = await Inventory.updateMany(
    { _id: { $in: items } },
    { $set: { issuedOut: false } }
  );

  if (result.modifiedCount === 0) {
    throw new CustomError("No items found to reject", 404);
  }

  const allItemsRejected = result.modifiedCount === items.length;

  if (allItemsRejected) {
    const firstItemId = items[0];
    const inventoryItem = await Inventory.findById(firstItemId);

    const requesterId = inventoryItem.user_id;

    await Requester.findOneAndUpdate(
      { user_id: requesterId },
      { status: "rejected" }
    );
  }

  return result;
};
