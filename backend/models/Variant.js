const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const VariantSchema = new Schema(
  {
    restaurantId: { type: Schema.Types.ObjectId, ref: "Restaurant", required: true, index: true },
    menuItemId: { type: Schema.Types.ObjectId, ref: "MenuItem", required: true, index: true },
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Variant || mongoose.model("Variant", VariantSchema);
