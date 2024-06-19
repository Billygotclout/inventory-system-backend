const mongoose = require("mongoose");

const requesterSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  region: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  purpose: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },

  issuanceDate: { type: Date, default: Date.now() + 3600000 },
  items: [{ type: mongoose.Schema.Types.ObjectId }],
  paymentEvidence: {
    type: String,
    required: true,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("Requester", requesterSchema);
