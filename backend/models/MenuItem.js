const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MenuItemSchema = new Schema(
  {
    restaurantId: { type: Schema.Types.ObjectId, ref: "Restaurant", required: true, index: true },
    categoryId: { type: Schema.Types.ObjectId, ref: "Category", required: true, index: true },
    name: { type: String, required: true, trim: true },
    description: { type: String },
    price: { type: Number, required: true, min: 0 },
    images: [{ type: String }],
    videoUrl: { type: String },
    calories: { type: Number, min: 0 },
    preparationTime: { type: Number, min: 0 },
    ingredients: [{ type: String }],
    allergens: [{ type: String }],
    foodType: { type: String, enum: ["veg", "non-veg", "jain"], default: "veg" },
    spicyLevel: { type: Number, min: 0, max: 3, default: 0 },
    isRecommended: { type: Boolean, default: false },
    isPopular: { type: Boolean, default: false },
    isOutOfStock: { type: Boolean, default: false },
    variants: [{ type: Schema.Types.ObjectId, ref: "Variant" }],
    addons: [{ type: Schema.Types.ObjectId, ref: "Addon" }],
    branchAvailability: [{ type: Schema.Types.ObjectId, ref: "Branch" }],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.models.MenuItem || mongoose.model("MenuItem", MenuItemSchema);
