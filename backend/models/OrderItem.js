const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OrderItemSchema = new Schema(
  {
    orderId: { type: Schema.Types.ObjectId, ref: "Order", required: true, index: true },
    menuItemId: { type: Schema.Types.ObjectId, ref: "MenuItem", required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 1 },
    selectedVariant: {
      name: { type: String },
      price: { type: Number },
    },
    selectedAddons: [
      {
        name: { type: String, required: true },
        price: { type: Number, required: true },
      },
    ],
    specialInstructions: { type: String },
    status: {
      type: String,
      enum: ["Pending", "Preparing", "Ready", "Served", "Cancelled"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.models.OrderItem || mongoose.model("OrderItem", OrderItemSchema);
