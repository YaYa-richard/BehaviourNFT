// controllers/postsController.js
const Post = require("../models/Post");
const UserAction = require("../models/UserAction");
const User = require("../models/User"); // 确保导入了 User 模型

exports.getPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skipIndex = (page - 1) * limit;
    const searchTerm = req.query.search || "";

    const query = searchTerm
      ? { content: { $regex: searchTerm, $options: "i" } }
      : {};

    const total = await Post.countDocuments(query);
    const posts = await Post.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skipIndex)
      .exec();

    res.json({
      posts: posts,
      total: total,
    });
  } catch (error) {
    res.status(500).json({ error: "获取帖子失败" });
  }
};

exports.createPost = async (req, res) => {
  try {
    const { author, content } = req.body;
    const newPost = new Post({ author, content, likes: [], comments: [] });
    const savedPost = await newPost.save();

    // 记录用户行为
    const userAction = new UserAction({
      user: author,
      action: "create_post",
      details: { postId: savedPost._id, content: content },
    });
    await userAction.save();

    // 获取或创建用户对象
    let user = await User.findOne({ walletAddress: author });
    if (!user) {
      user = new User({ walletAddress: author });
      await user.save(); // 保存新用户到数据库
    }

    // 调用综合兴趣检测函数
    await userAction.detectAllInterests(user, "create_post", content);

    res.json(savedPost);
  } catch (error) {
    console.error("发布帖子失败", error);
    res.status(500).json({ error: "发布帖子失败" });
  }
};

exports.likePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const { user } = req.body;
    const post = await Post.findById(postId);
    if (!post.likes.includes(user)) {
      post.likes.push(user);
    }
    const updatedPost = await post.save();

    // 记录用户行为
    const userAction = new UserAction({
      user,
      action: "like_post",
      details: { postId },
    });
    await userAction.save();

    // 获取或创建用户对象
    let userOBJ = await User.findOne({ walletAddress: user });
    if (!userOBJ) {
      userOBJ = new User({ walletAddress: user });
      await userOBJ.save(); // 保存新用户到数据库
    }

    // 调用综合兴趣检测函数
    await userAction.detectAllInterests(userOBJ, "like_post", post.content);

    res.json({ likes: updatedPost.likes.length });
  } catch (error) {
    console.error("点赞失败", error);
    res.status(500).json({ error: "点赞失败" });
  }
};

exports.commentPost = async (req, res) => {
  try {
    const postId = req.params.id;
    const { author, content } = req.body;
    const post = await Post.findById(postId);
    post.comments.push({ author, content });
    const updatedPost = await post.save();

    // 记录用户行为，包含评论内容
    const userAction = new UserAction({
      user: author,
      action: "comment_post",
      details: { postId, comment: content },
    });
    await userAction.save();

    // 获取或创建用户对象
    let userOBJ = await User.findOne({ walletAddress: author });
    if (!userOBJ) {
      userOBJ = new User({ walletAddress: author });
      await userOBJ.save(); // 保存新用户到数据库
    }

    // 调用综合兴趣检测函数
    await userAction.detectAllInterests(userOBJ, "comment_post", content);

    res.json({ comments: updatedPost.comments });
  } catch (error) {
    console.error("评论失败", error);
    res.status(500).json({ error: "评论失败" });
  }
};
