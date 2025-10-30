const express3 = require("express");
const r3 = express3.Router();
const auth = require("../middleware/auth");
const Cart = require("../models/Cart");
const ProductM = require("../models/Product");

// addCart -> add item(s) to user's cart
// POST /api/cart
// body: { items: [{ product: productId, qty: number }] }
r3.post("/", auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { items } = req.body;
    if (!items || !Array.isArray(items))
      return res.status(400).json({ message: "items array required" });
    let cart = await Cart.findOne({ user: userId });
    if (!cart) cart = await Cart.create({ user: userId, items: [] });
    // merge items
    for (const it of items) {
      const prod = await ProductM.findById(it.product);
      if (!prod) continue;
      const exist = cart.items.find((x) => x.product.toString() === it.product);
      if (exist) exist.qty = Math.max(1, exist.qty + (it.qty || 1));
      else cart.items.push({ product: it.product, qty: it.qty || 1 });
    }
    await cart.save();
    res.json(cart);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// get current user's cart
r3.get("/", auth, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate(
      "items.product"
    );
    res.json(cart || { items: [] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = r3;
