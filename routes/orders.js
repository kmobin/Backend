const express5 = require("express");
const r5 = express5.Router();
const auth5 = require("../middleware/auth");
const Cart5 = require("../models/Cart");
const OrderM = require("../models/Order");
const Product5 = require("../models/Product");

// place order from cart
r5.post("/", auth5, async (req, res) => {
  try {
    const userId = req.user.id;
    const cart = await Cart5.findOne({ user: userId }).populate(
      "items.product"
    );
    if (!cart || cart.items.length === 0)
      return res.status(400).json({ message: "Cart empty" });
    let total = 0;
    const items = cart.items.map((i) => {
      const price = i.product.price;
      total += price * i.qty;
      return { product: i.product._id, qty: i.qty, price };
    });
    const order = await OrderM.create({ user: userId, items, total });
    // clear cart
    cart.items = [];
    await cart.save();
    res.status(201).json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// get current user's orders
r5.get("/", auth5, async (req, res) => {
  try {
    const orders = await OrderM.find({ user: req.user.id }).populate(
      "items.product"
    );
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = r5;
