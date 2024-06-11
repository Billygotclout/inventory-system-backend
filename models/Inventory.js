const mongoose = require("mongoose");

const inventorySchema = mongoose.Schema(
  {
    serialNumber: {
      type: String,
      required: true,
      unique: true,
    },

    model: {
      type: String,
      required: true,
    },
    purchaseDate: {
      type: Date,
      required: true,
    },
    deliveryDate: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "approved"],
      default: "pending",
    },
    image: {
      type: String,
    },
    color: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    costPerUnit: {
      type: Number,
      required: true,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    category: {
      type: String,
    },
    file_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FileUpload",
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Inventory", inventorySchema);
