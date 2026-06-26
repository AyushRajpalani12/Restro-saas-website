const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TableSchema = new Schema(
  {
    restaurantId: { type: Schema.Types.ObjectId, ref: "Restaurant", required: true, index: true },
    branchId: { type: Schema.Types.ObjectId, ref: "Branch", required: true, index: true },
    tableNumber: { type: String, required: true, trim: true },
    seatingCapacity: { type: Number, required: true, min: 1, default: 2 },
    status: { type: String, enum: ["available", "occupied", "reserved"], default: "available" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

TableSchema.index({ branchId: 1, tableNumber: 1 }, { unique: true });

module.exports = mongoose.models.Table || mongoose.model("Table", TableSchema);
