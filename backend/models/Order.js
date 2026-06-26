const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OrderSchema = new Schema(
  {
    restaurantId: { type: Schema.Types.ObjectId, ref: "Restaurant", required: true, index: true },
    branchId: { type: Schema.Types.ObjectId, ref: "Branch", required: true, index: true },
    tableId: { type: Schema.Types.ObjectId, ref: "Table", index: true },
    customerId: { type: Schema.Types.ObjectId, ref: "Customer", index: true },
    customerName: { type: String, trim: true },
    customerPhone: { type: String, trim: true },
    type: { type: String, enum: ["dine-in", "takeaway", "delivery"], required: true, default: "dine-in" },
    status: {
      type: String,
      enum: ["Pending", "Accepted", "Preparing", "Ready", "Completed", "Cancelled"],
      default: "Pending",
      index: true,
    },
    subtotal: { type: Number, required: true, min: 0 },
    cgst: { type: Number, required: true, min: 0, default: 0 },
    sgst: { type: Number, required: true, min: 0, default: 0 },
    igst: { type: Number, required: true, min: 0, default: 0 },
    serviceCharge: { type: Number, required: true, min: 0, default: 0 },
    deliveryCharge: { type: Number, required: true, min: 0, default: 0 },
    discount: { type: Number, required: true, min: 0, default: 0 },
    total: { type: Number, required: true, min: 0 },
    couponCode: { type: String, trim: true },
    paymentStatus: { type: String, enum: ["Pending", "Paid", "Failed"], default: "Pending", index: true },
    paymentMethod: { type: String, enum: ["Cash", "Card", "UPI", "Razorpay", "Stripe"], default: "Cash" },
    items: [{ type: Schema.Types.ObjectId, ref: "OrderItem" }],
    specialInstructions: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Order || mongoose.model("Order", OrderSchema);
