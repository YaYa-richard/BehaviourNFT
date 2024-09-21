// models/Post.js
const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
    author: String,
    content: String,
    createdAt: { type: Date, default: Date.now },
});

const PostSchema = new mongoose.Schema({
    author: String,
    content: String,
    likes: [String], // 存储点赞用户的地址
    comments: [CommentSchema],
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Post", PostSchema);
