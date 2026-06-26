const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const LeadSchema = new Schema(
  {
    restaurantName: { type: String, required: true, trim: true },
    ownerName: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    message: { type: String, trim: true },
    status: {
      type: String,
      enum: ["Pending", "Contacted", "Onboarded", "Rejected"],
      default: "Pending",
      index: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Lead || mongoose.model("Lead", LeadSchema);
