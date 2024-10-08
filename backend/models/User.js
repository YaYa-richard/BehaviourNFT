// models/User.js
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  walletAddress: { type: String, required: true, unique: true },
  preferences: {
    sports: { type: Number, min: -1, max: 1, default: 0 },
    technology: { type: Number, min: -1, max: 1, default: 0 },
    music: { type: Number, min: -1, max: 1, default: 0 },
    history: { type: Number, min: -1, max: 1, default: 0 },
    art: { type: Number, min: -1, max: 1, default: 0 },
  },
  timestamp: { type: Date, default: Date.now }, // 添加时间戳
  // 其他用户属性可以在这里添加
});

UserSchema.pre("save", function (next) {
  this.timestamp = Date.now();
  next();
});

module.exports = mongoose.model("User", UserSchema);
