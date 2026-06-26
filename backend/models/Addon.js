const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AddonSchema = new Schema(
  {
    restaurantId: { type: Schema.Types.ObjectId, ref: "Restaurant", required: true, index: true },
    menuItemId: { type: Schema.Types.ObjectId, ref: "MenuItem", index: true },
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Addon || mongoose.model("Addon", AddonSchema);
