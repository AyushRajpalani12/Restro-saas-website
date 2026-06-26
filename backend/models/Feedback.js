const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const FeedbackSchema = new Schema(
  {
    restaurantId: { type: Schema.Types.ObjectId, ref: "Restaurant", required: true, index: true },
    branchId: { type: Schema.Types.ObjectId, ref: "Branch", required: true, index: true },
    orderId: { type: Schema.Types.ObjectId, ref: "Order", index: true },
    customerName: { type: String, required: true, trim: true },
    customerPhone: { type: String, trim: true },
    ratingService: { type: Number, required: true, min: 1, max: 5 },
    ratingFood: { type: Number, required: true, min: 1, max: 5 },
    ratingAmbiance: { type: Number, required: true, min: 1, max: 5 },
    ratingOverall: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Feedback || mongoose.model("Feedback", FeedbackSchema);
