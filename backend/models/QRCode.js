const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const QRCodeSchema = new Schema(
  {
    restaurantId: { type: Schema.Types.ObjectId, ref: "Restaurant", required: true, index: true },
    branchId: { type: Schema.Types.ObjectId, ref: "Branch", required: true, index: true },
    tableId: { type: Schema.Types.ObjectId, ref: "Table", index: true },
    type: { type: String, enum: ["table", "takeaway", "delivery", "payment"], default: "table" },
    qrCodeUrl: { type: String },
    scanCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.models.QRCode || mongoose.model("QRCode", QRCodeSchema);
