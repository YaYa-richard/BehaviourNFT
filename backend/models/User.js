const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    walletAddress: { type: String, required: true, unique: true },
    // 其他用户属性可以在这里添加
});

module.exports = mongoose.model("User", UserSchema);
