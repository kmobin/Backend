const { Schema: S, model: M } = require("mongoose");
const productSchema = new S(
  {
    name: { type: String, required: true, index: true },
    description: String,
    price: { type: Number, required: true },
    category: { type: String, index: true },
    isOffer: { type: Boolean, default: false },
    stock: { type: Number, default: 0 },
    images: [String],
  },
  { timestamps: true }
);
module.exports = M("Product", productSchema);
