const express2 = require("express");
const r2 = express2.Router();
const Product = require("../models/Product");

// Create product (admin) - for testing purposes
r2.post("/", async (req, res) => {
  try {
    const p = await Product.create(req.body);
    res.status(201).json(p);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Bad request" });
  }
});

// Get products (with query options)
// - ?offer=true
// - /search?name=xxx
// - /category/:category
r2.get("/", async (req, res) => {
  try {
    const { offer } = req.query;
    const filter = {};
    if (offer === "true") filter.isOffer = true;
    const products = await Product.find(filter).limit(100);
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

r2.get("/search", async (req, res) => {
  try {
    const { name } = req.query;
    if (!name) return res.status(400).json({ message: "Provide name" });
    const regex = new RegExp(name, "i");
    const products = await Product.find({ name: regex }).limit(50);
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

r2.get("/category/:category", async (req, res) => {
  try {
    const { category } = req.params;
    const products = await Product.find({ category }).limit(100);
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = r2;
