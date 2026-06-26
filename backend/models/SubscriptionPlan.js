const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SubscriptionPlanSchema = new Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    billingCycle: { type: String, enum: ["monthly", "yearly"], required: true, default: "monthly" },
    maxBranches: { type: Number, required: true, default: 1 },
    maxTablesPerBranch: { type: Number, required: true, default: 10 },
    maxMenuItems: { type: Number, required: true, default: 50 },
    features: [{ type: String }],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.models.SubscriptionPlan || mongoose.model("SubscriptionPlan", SubscriptionPlanSchema);
