const { Schema, model } = require("mongoose");
const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    address: { type: String },
    phone: { type: String },
    isAdmin: { type: Boolean, default: false },
  },
  { timestamps: true }
);
module.exports = model("User", userSchema);
