const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PaymentSchema = new Schema(
  {
    restaurantId: { type: Schema.Types.ObjectId, ref: "Restaurant", required: true, index: true },
    branchId: { type: Schema.Types.ObjectId, ref: "Branch", required: true, index: true },
    orderId: { type: Schema.Types.ObjectId, ref: "Order", required: true, index: true },
    invoiceId: { type: Schema.Types.ObjectId, ref: "Invoice" },
    transactionId: { type: String, trim: true },
    paymentGateway: {
      type: String,
      enum: ["Razorpay", "Stripe", "Cash", "Card", "UPI"],
      required: true,
      default: "Cash",
    },
    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, required: true, default: "INR" },
    status: { type: String, enum: ["pending", "success", "failed", "refunded"], default: "pending", index: true },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Payment || mongoose.model("Payment", PaymentSchema);
