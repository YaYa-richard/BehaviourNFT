// models/UserAction.js
const mongoose = require("mongoose");

const UserActionSchema = new mongoose.Schema({
  user: String, // 用户钱包地址
  action: String, // 行为类型：search、like_post、comment_post、create_post
  details: Object, // 具体的行为细节（如搜索关键词，帖子ID等）
  createdAt: { type: Date, default: Date.now },
});

// 兴趣检测
UserActionSchema.methods.detectAllInterests = async function (
  user,
  action,
  comment
) {
  let value;
  switch (action) {
    case "create_post":
      value = 0.3;
      break;
    case "like_post":
      value = 0.1;
      break;
    case "comment_post":
      value = 0.2;
      break;
    default:
      value = 0;
      break;
  }
  comment = comment.toLowerCase();
  // 调用运动兴趣检测
  const sportsInterests = await this.detectSportsPreference(
    user,
    action,
    comment,
    value
  );
  // 调用科技兴趣检测
  const techInterests = await this.detectTechPreference(
    user,
    action,
    comment,
    value
  );
  // 调用音乐兴趣检测
  const musicInterests = await this.detectMusicPreference(
    user,
    action,
    comment,
    value
  );
};

// 运动兴趣偏好检测
UserActionSchema.methods.detectSportsPreference = async function (
  user,
  action,
  comment,
  value
) {
  if (comment) {
    const tokens = comment.split(/\s+/);
    const interestCategories = {
      Sports: {
        likes: ["like", "love", "passionate about", "interested in", "prefer"],
        dislikes: ["dislike", "hate", "detest"],
        keywords: [
          "soccer",
          "basketball",
          "table tennis",
          "badminton",
          "tennis",
          "swimming",
          "running",
          "cycling",
        ],
      },
    };

    const foundInterests = {};

    for (const [category, keywords] of Object.entries(interestCategories)) {
      const hasLike = tokens.some((token) => keywords.likes.includes(token));
      const hasDislike = tokens.some((token) =>
        keywords.dislikes.includes(token)
      );
      const containsSport = tokens.some((token) =>
        keywords.keywords.includes(token)
      );

      if (containsSport) {
        // 初始化用户偏好字段
        user.preferences = user.preferences || {};
        user.preferences.sports = user.preferences.sports || 0;

        if (hasLike) {
          foundInterests[category] = "likes";
          // 更新用户的运动偏好
          user.preferences.sports = Math.min(
            1,
            user.preferences.sports + value
          );
        } else if (hasDislike) {
          foundInterests[category] = "dislikes";
          // 更新用户的运动偏好
          user.preferences.sports = Math.max(
            -1,
            user.preferences.sports - value
          );
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
UserActionSchema.methods.detectTechPreference = async function (
  user,
  action,
  comment,
  value
) {
  if (comment) {
    const tokens = comment.split(/\s+/);
    const interestCategories = {
      Technology: {
        likes: ["like", "love", "passionate about", "interested in", "prefer"],
        dislikes: ["dislike", "hate", "detest"],
        keywords: [
          "ai",
          "artificial intelligence",
          "machine learning",
          "blockchain",
          "vr",
          "virtual reality",
          "ar",
          "augmented reality",
          "gadgets",
          "technology",
        ],
      },
    };

    const foundInterests = {};

    for (const [category, keywords] of Object.entries(interestCategories)) {
      const hasLike = tokens.some((token) => keywords.likes.includes(token));
      const hasDislike = tokens.some((token) =>
        keywords.dislikes.includes(token)
      );
      const containsTech = tokens.some((token) =>
        keywords.keywords.includes(token)
      );

      if (containsTech) {
        // 初始化用户偏好字段
        user.preferences = user.preferences || {};
        user.preferences.technology = user.preferences.technology || 0;

        if (hasLike) {
          foundInterests[category] = "likes";
          // 更新用户的科技偏好
          user.preferences.technology = Math.min(
            1,
            user.preferences.technology + value
          );
        } else if (hasDislike) {
          foundInterests[category] = "dislikes";
          // 更新用户的科技偏好
          user.preferences.technology = Math.max(
            -1,
            user.preferences.technology - value
          );
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
UserActionSchema.methods.detectMusicPreference = async function (
  user,
  action,
  comment,
  value
) {
  if (comment) {
    const tokens = comment.split(/\s+/);
    const interestCategories = {
      Music: {
        likes: ["like", "love", "passionate about", "interested in", "prefer"],
        dislikes: ["dislike", "hate", "detest"],
        keywords: [
          "rock",
          "pop",
          "jazz",
          "classical",
          "hip-hop",
          "edm",
          "blues",
          "country",
          "reggae",
          "music",
        ],
      },
    };

    const foundInterests = {};

    for (const [category, keywords] of Object.entries(interestCategories)) {
      const hasLike = tokens.some((token) => keywords.likes.includes(token));
      const hasDislike = tokens.some((token) =>
        keywords.dislikes.includes(token)
      );
      const containsMusic = tokens.some((token) =>
        keywords.keywords.includes(token)
      );

      if (containsMusic) {
        // 初始化用户偏好字段
        user.preferences = user.preferences || {};
        user.preferences.music = user.preferences.music || 0;

        if (hasLike) {
          foundInterests[category] = "likes";
          // 更新用户的音乐偏好
          user.preferences.music = Math.min(1, user.preferences.music + value);
        } else if (hasDislike) {
          foundInterests[category] = "dislikes";
          // 更新用户的音乐偏好
          user.preferences.music = Math.max(-1, user.preferences.music - value);
        }

        try {
          await user.save(); // 保存更新
          console.log(`用户 ${user.walletAddress} 的音乐偏好已更新并保存。`);
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
