const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ThemeSchema = new Schema(
  {
    restaurantId: { type: Schema.Types.ObjectId, ref: "Restaurant", required: true, unique: true, index: true },
    primaryColor: { type: String, required: true, default: "#ea580c" },
    secondaryColor: { type: String, required: true, default: "#1e293b" },
    backgroundColor: { type: String },
    textColor: { type: String },
    fontFamily: {
      type: String,
      enum: ["Inter", "Roboto", "Outfit", "Playfair Display"],
      default: "Outfit",
    },
    faviconUrl: { type: String },
    customCss: { type: String },
    invoiceHeader: { type: String },
    invoiceFooter: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Theme || mongoose.model("Theme", ThemeSchema);
