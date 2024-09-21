// models/User.js
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  walletAddress: { type: String, required: true, unique: true },
  preferences: {
    sports: { type: Number, min: -1, max: 1, default: 0 },
    technology: { type: Number, min: -1, max: 1, default: 0 },
    music: { type: Number, min: -1, max: 1, default: 0 },
  },
  // 其他用户属性可以在这里添加
});

module.exports = mongoose.model("User", UserSchema);
