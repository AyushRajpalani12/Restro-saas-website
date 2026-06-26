const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const NotificationSchema = new Schema(
  {
    restaurantId: { type: Schema.Types.ObjectId, ref: "Restaurant", index: true },
    branchId: { type: Schema.Types.ObjectId, ref: "Branch", index: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", index: true },
    title: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    type: {
      type: String,
      enum: ["new_order", "kitchen_update", "waiter_call", "inventory_alert", "system"],
      required: true,
      default: "system",
      index: true,
    },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Notification || mongoose.model("Notification", NotificationSchema);
