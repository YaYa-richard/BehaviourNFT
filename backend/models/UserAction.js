// models/UserAction.js
const mongoose = require("mongoose");

const UserActionSchema = new mongoose.Schema({
  user: String, // 用户钱包地址
  action: String, // 行为类型：search、like_post、comment_post、create_post
  details: Object, // 具体的行为细节（如搜索关键词，帖子ID等）
  createdAt: { type: Date, default: Date.now },
});

// 兴趣检测
UserActionSchema.methods.detectAllInterests = async function (user) {
  const interests = {};

  // 调用运动兴趣检测
  const sportsInterests = await this.detectSportsPreference(user);
  if (Object.keys(sportsInterests).length) {
    interests.sports = sportsInterests;
  }

  // 调用科技兴趣检测
  const techInterests = await this.detectTechPreference(user);
  if (Object.keys(techInterests).length) {
    interests.tech = techInterests;
  }

  return interests;
};

// 运动兴趣偏好检测
UserActionSchema.methods.detectSportsPreference = async function (user) {
  if (this.action === 'comment_post' && this.details.comment) {
    const tokens = this.details.comment.split(/\s+/);
    const interestCategories = {
      '运动': {
        likes: ['喜欢', '爱', '热爱', '感兴趣', '偏爱'],
        dislikes: ['不喜欢', '厌恶', '讨厌'],
        keywords: ['足球', '篮球', '乒乓球', '羽毛球', '网球', '游泳', '跑步', '自行车'],
      },
    };

    const foundInterests = {};

    for (const [category, keywords] of Object.entries(interestCategories)) {
      const hasLike = tokens.some(token => keywords.likes.includes(token));
      const hasDislike = tokens.some(token => keywords.dislikes.includes(token));
      const containsSport = tokens.some(token => keywords.keywords.includes(token));

      if (containsSport) {
        // 初始化用户偏好字段
        user.preferences = user.preferences || {};
        user.preferences.sports = user.preferences.sports || 0;

        if (hasLike) {
          foundInterests[category] = '喜欢';
          // 更新用户的运动偏好
          user.preferences.sports = Math.min(1, user.preferences.sports + 0.3);
        } else if (hasDislike) {
          foundInterests[category] = '不喜欢';
          // 更新用户的运动偏好
          user.preferences.sports = Math.max(-1, user.preferences.sports - 0.3);
        }

        try {
          await user.save(); // 保存更新
          console.log(`用户 ${user.walletAddress} 的运动偏好已更新并保存。`);
        } catch (error) {
          console.error("保存用户数据时出错：", error);
        }
      }
    }

    return foundInterests;
  }
  return {};
};

// 科技兴趣偏好检测
UserActionSchema.methods.detectTechPreference = async function (user) {
  if (this.action === 'comment_post' && this.details.comment) {
    const tokens = this.details.comment.split(/\s+/);
    const interestCategories = {
      '科技': {
        likes: ['喜欢', '爱', '热爱', '感兴趣', '偏爱'],
        dislikes: ['不喜欢', '厌恶', '讨厌'],
        keywords: ['人工智能', '机器学习', '编程', '区块链', '虚拟现实', '5G', '科技', '电动汽车'],
      },
    };

    const foundInterests = {};

    for (const [category, keywords] of Object.entries(interestCategories)) {
      const hasLike = tokens.some(token => keywords.likes.includes(token));
      const hasDislike = tokens.some(token => keywords.dislikes.includes(token));
      const containsTech = tokens.some(token => keywords.keywords.includes(token));

      if (containsTech) {
        // 初始化用户偏好字段
        user.preferences = user.preferences || {};
        user.preferences.technology = user.preferences.technology || 0;

        if (hasLike) {
          foundInterests[category] = '喜欢';
          // 更新用户的科技偏好
          user.preferences.technology = Math.min(1, user.preferences.technology + 0.3);
        } else if (hasDislike) {
          foundInterests[category] = '不喜欢';
          // 更新用户的科技偏好
          user.preferences.technology = Math.max(-1, user.preferences.technology - 0.3);
        }

        try {
          await user.save(); // 保存更新
          console.log(`用户 ${user.walletAddress} 的科技偏好已更新并保存。`);
        } catch (error) {
          console.error("保存用户数据时出错：", error);
        }
      }
    }

    return foundInterests;
  }
  return {};
};

module.exports = mongoose.model("UserAction", UserActionSchema);
