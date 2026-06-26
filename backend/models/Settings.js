const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SettingsSchema = new Schema(
  {
    restaurantId: { type: Schema.Types.ObjectId, ref: "Restaurant", required: true, index: true },
    branchId: { type: Schema.Types.ObjectId, ref: "Branch", required: true, unique: true, index: true },
    currency: { type: String, required: true, default: "INR" },
    gstNumber: { type: String, trim: true },
    cgstRate: { type: Number, required: true, default: 2.5, min: 0 },
    sgstRate: { type: Number, required: true, default: 2.5, min: 0 },
    igstRate: { type: Number, required: true, default: 0, min: 0 },
    serviceChargeRate: { type: Number, required: true, default: 0, min: 0 },
    deliveryChargeRate: { type: Number, required: true, default: 0, min: 0 },
    enableSoundAlerts: { type: Boolean, default: true },
    thermalPrinterWidth: { type: String, enum: ["58mm", "80mm"], default: "80mm" },
    tableCallOption: { type: Boolean, default: true },
    isOfflineMode: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Settings || mongoose.model("Settings", SettingsSchema);
