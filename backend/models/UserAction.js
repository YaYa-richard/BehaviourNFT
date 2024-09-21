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
  // 调用历史兴趣检测
  const historyInterests = await this.detectHistoryPreference(
    user,
    action,
    comment,
    value
  );
  // 调用艺术兴趣检测
  const artInterests = await this.detectArtPreference(
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
        likes: [
          "like",
          "love",
          "passionate about",
          "interested in",
          "prefer",
          "enjoy",
          "crazy about",
          "adore",
          "intersing",
        ],
        dislikes: ["dislike", "hate", "detest", "loathe", "boring"],
        keywords: [
          "soccer",
          "basketball",
          "table tennis",
          "badminton",
          "tennis",
          "swimming",
          "running",
          "cycling",
          "football",
          "baseball",
          "golf",
          "hiking",
          "skiing",
          "snowboarding",
          "volleyball",
          "cricket",
          "rugby",
          "yoga",
          "martial arts",
          "gymnastics",
          "dance",
          "fitness",
          "weightlifting",
          "rock climbing",
          "surfing",
          "boxing",
          "track and field",
          "ultimate frisbee",
          "motorsport",
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
        likes: [
          "like",
          "love",
          "passionate about",
          "interested in",
          "prefer",
          "enjoy",
          "crazy about",
          "adore",
          "intersing",
        ],
        dislikes: ["dislike", "hate", "detest", "loathe", "boring"],
        keywords: [
          "ai",
          "artificial intelligence",
          "machine learning",
          "deep learning",
          "blockchain",
          "vr",
          "virtual reality",
          "ar",
          "augmented reality",
          "gadgets",
          "technology",
          "iot",
          "Internet of Things",
          "big data",
          "cloud computing",
          "cybersecurity",
          "data science",
          "robotics",
          "5g",
          "quantum computing",
          "wearable technology",
          "smart home",
          "autonomous vehicles",
          "programming",
          "software development",
          "hardware",
          "open source",
          "digital transformation",
          "fintech",
          "edtech",
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
        likes: [
          "like",
          "love",
          "passionate about",
          "interested in",
          "prefer",
          "enjoy",
          "crazy about",
          "adore",
          "intersing",
        ],
        dislikes: ["dislike", "hate", "detest", "loathe", "boring"],
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
          "r&b",
          "soul",
          "alternative",
          "indie",
          "metal",
          "punk",
          "synth-pop",
          "folk",
          "gospel",
          "dance",
          "grunge",
          "k-pop",
          "j-pop",
          "adele",
          "taylor swift",
          "drake",
          "beyoncé",
          "ed sheeran",
          "billie eilish",
          "kendrick lamar",
          "bruno mars",
          "the weeknd",
          "lady gaga",
          "post malone",
          "dua lipa",
          "elton john",
          "madonna",
          "bts",
          "blackpink",
          "kanye west",
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
UserActionSchema.methods.detectHistoryPreference = async function (
  user,
  action,
  comment,
  value
) {
  if (comment) {
    const tokens = comment.split(/\s+/);
    const interestCategories = {
      LiteraryHistory: {
        likes: [
          "like",
          "love",
          "passionate about",
          "interested in",
          "prefer",
          "enjoy",
          "crazy about",
          "adore",
        ],
        dislikes: ["dislike", "hate", "detest", "loathe", "boring"],
        keywords: [
          "history",
          "ancient",
          "medieval",
          "modern",
          "civilization",
          "archaeology",
          "historical",
          "events",
          "chronicle",
          "empire",
          "revolution",
          "war",
          "nation",
          "kingdom",
          "dynasty",
          "sociology",
          "culture",
          "historian",
          "artifact",
          "treaty",
          "monument",
        ],
      },
    };

    const foundInterests = {};

    for (const [category, keywords] of Object.entries(interestCategories)) {
      const hasLike = tokens.some((token) => keywords.likes.includes(token));
      const hasDislike = tokens.some((token) =>
        keywords.dislikes.includes(token)
      );
      const containsLiterature = tokens.some((token) =>
        keywords.keywords.includes(token)
      );

      if (containsLiterature) {
        // 初始化用户偏好字段
        user.preferences = user.preferences || {};
        user.preferences.history = user.preferences.literaryHistory || 0;

        if (hasLike) {
          foundInterests[category] = "likes";
          // 更新用户的文史偏好
          user.preferences.history = Math.min(
            1,
            user.preferences.history + value
          );
        } else if (hasDislike) {
          foundInterests[category] = "dislikes";
          // 更新用户的文史偏好
          user.preferences.history = Math.max(
            -1,
            user.preferences.history - value
          );
        }

        try {
          await user.save(); // 保存更新
          console.log(`用户 ${user.walletAddress} 的文史偏好已更新并保存。`);
        } catch (error) {
          console.error("保存用户数据时出错：", error);
        }
      }
    }

    return foundInterests;
  }
  return {};
};
UserActionSchema.methods.detectArtPreference = async function (
  user,
  action,
  comment,
  value
) {
  if (comment) {
    const tokens = comment.split(/\s+/);
    const interestCategories = {
      Art: {
        likes: [
          "like",
          "love",
          "passionate about",
          "interested in",
          "prefer",
          "enjoy",
          "crazy about",
          "adore",
        ],
        dislikes: ["dislike", "hate", "detest", "loathe", "boring"],
        keywords: [
          "art",
          "painting",
          "sculpture",
          "drawing",
          "photography",
          "modern art",
          "abstract",
          "classical",
          "installation",
          "gallery",
          "museum",
          "exhibition",
          "artist",
          "canvas",
          "color",
          "design",
          "illustration",
          "street art",
          "performance",
          "visual arts",
          "crafts",
        ],
      },
    };

    const foundInterests = {};

    for (const [category, keywords] of Object.entries(interestCategories)) {
      const hasLike = tokens.some((token) => keywords.likes.includes(token));
      const hasDislike = tokens.some((token) =>
        keywords.dislikes.includes(token)
      );
      const containsArt = tokens.some((token) =>
        keywords.keywords.includes(token)
      );

      if (containsArt) {
        // 初始化用户偏好字段
        user.preferences = user.preferences || {};
        user.preferences.art = user.preferences.art || 0;

        if (hasLike) {
          foundInterests[category] = "likes";
          // 更新用户的艺术偏好
          user.preferences.art = Math.min(1, user.preferences.art + value);
        } else if (hasDislike) {
          foundInterests[category] = "dislikes";
          // 更新用户的艺术偏好
          user.preferences.art = Math.max(-1, user.preferences.art - value);
        }

        try {
          await user.save(); // 保存更新
          console.log(`用户 ${user.walletAddress} 的艺术偏好已更新并保存。`);
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
