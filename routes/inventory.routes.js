const express = require("express");

const validateToken = require("../middleware/validateToken");
const {
  toggleInventoryType,
  createNewInventory,
  getAllInventoryItems,
  getInventoryItem,
  approveInventory,
  searchInventoryItems,
} = require("../controllers/inventory.controller");
const roleChecker = require("../middleware/roleChecker");

const router = express.Router();
router.use(validateToken);
router.route("/get-all").get(getAllInventoryItems);
router.route("/get/:id").get(getInventoryItem);
router.route("/search").get(searchInventoryItems);
router
  .route("/approve-inventory/:id")
  .put(roleChecker("checker"), approveInventory);

router.use(roleChecker("maker"));
router.route("/set-type-status").put(toggleInventoryType);
router.route("/create").post(createNewInventory);

module.exports = router;
