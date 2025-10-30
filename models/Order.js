const { Schema: S2, model: M2 } = require("mongoose");
const orderSchema = new S2(
  {
    user: { type: S2.Types.ObjectId, ref: "User", required: true },
    items: [
      {
        product: { type: S2.Types.ObjectId, ref: "Product" },
        qty: Number,
        price: Number,
      },
    ],
    total: Number,
    status: { type: String, default: "placed" },
  },
  { timestamps: true }
);
module.exports = M2("Order", orderSchema);
