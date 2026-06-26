const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RestaurantSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    logo: { type: String },
    banner: { type: String },
    customDomain: { type: String, unique: true, sparse: true, lowercase: true, trim: true },
    isActive: { type: Boolean, default: true },
    isSuspended: { type: Boolean, default: false },
    status: { type: String, enum: ["active", "inactive", "suspended"], default: "active" },
    subscriptionPlan: { type: Schema.Types.ObjectId, ref: "SubscriptionPlan", required: true },
    subscriptionStatus: { type: String, enum: ["active", "past_due", "canceled", "trialing"], default: "trialing" },
    subscriptionEndsAt: { type: Date },
    billingEmail: { type: String, required: true, trim: true },
    phone: { type: String },
    address: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Restaurant || mongoose.model("Restaurant", RestaurantSchema);
