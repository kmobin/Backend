const express4 = require("express");
const r4 = express4.Router();
const auth4 = require("../middleware/auth");
const UserM = require("../models/User");
const bcrypt4 = require("bcryptjs");

// Update user details (authenticated)
r4.put("/", auth4, async (req, res) => {
  try {
    const updates = {};
    const allowed = ["name", "address", "phone", "email", "password"];
    for (const k of allowed) if (req.body[k]) updates[k] = req.body[k];
    if (updates.password) {
      const salt = await bcrypt4.genSalt(10);
      updates.password = await bcrypt4.hash(updates.password, salt);
    }
    const user = await UserM.findByIdAndUpdate(req.user.id, updates, {
      new: true,
    }).select("-password");
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

//get User

r4.get("/", auth4, async (req, res) => {
  try {
    const user = await UserM.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = r4;
