const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    password: { type: String },
    role: {
      type: String,
      enum: ["SUPER_ADMIN", "RESTAURANT_ADMIN", "BRANCH_MANAGER", "KITCHEN", "STAFF", "CASHIER", "CUSTOMER"],
      required: true,
    },
    restaurantId: { type: Schema.Types.ObjectId, ref: "Restaurant", index: true },
    branchId: { type: Schema.Types.ObjectId, ref: "Branch", index: true },
    isActive: { type: Boolean, default: true },
    otpCode: { type: String },
    otpExpiresAt: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.models.User || mongoose.model("User", UserSchema);
