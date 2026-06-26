const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CouponSchema = new Schema(
  {
    restaurantId: { type: Schema.Types.ObjectId, ref: "Restaurant", required: true, index: true },
    code: { type: String, required: true, trim: true, uppercase: true },
    discountType: { type: String, enum: ["percentage", "fixed"], required: true, default: "percentage" },
    discountValue: { type: Number, required: true, min: 0 },
    minOrderValue: { type: Number, required: true, min: 0, default: 0 },
    maxDiscountAmount: { type: Number, min: 0 },
    isActive: { type: Boolean, default: true },
    startDate: { type: Date, required: true, default: Date.now },
    endDate: { type: Date, required: true },
    usageLimit: { type: Number },
    usageCount: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true }
);

CouponSchema.index({ restaurantId: 1, code: 1 }, { unique: true });

module.exports = mongoose.models.Coupon || mongoose.model("Coupon", CouponSchema);
