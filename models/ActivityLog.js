const mongoose = require("mongoose");

const activityLogSchema = mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  ip_address: {
    type: String,
    required: true,
  },
  device: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  activity: {
    type: String,
    required: true,
  },
  time: {
    type: Date,
    required: true,
  },
  module: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("ActivityLog", activityLogSchema);
