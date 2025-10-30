const jwt = require("jsonwebtoken");
const InvalidToken = require("../models/InvalidToken");
module.exports = async function (req, res, next) {
  const authHeader = req.header("Authorization");
  if (!authHeader) return res.status(401).json({ message: "No token" });
  const token = authHeader.replace("Bearer ", "");
  try {
    const black = await InvalidToken.findOne({ token });
    if (black)
      return res
        .status(401)
        .json({ message: "Token invalidated (logged out)" });
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: payload.id, isAdmin: payload.isAdmin };
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
