const mongoose = require("mongoose");

const UserActionSchema = new mongoose.Schema({
    user: String, // 用户钱包地址
    action: String, // 行为类型：search、like_post、comment_post、create_post
    details: Object, // 具体的行为细节（如搜索关键词，帖子ID等）
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("UserAction", UserActionSchema);
