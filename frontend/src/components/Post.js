// src/components/Post.js
import React, { useState, useEffect } from "react";
import { Card, Button, Input } from "antd";
import { LikeOutlined, LikeFilled, CommentOutlined } from "@ant-design/icons";
import axios from "axios";

const cardStyle = {
  margin: "20px 0",
  borderRadius: "8px",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
};

const buttonStyle = {
  color: "#9333ea",
};

const activeButtonStyle = {
  color: "#6b21a8", // 深紫色，表示激活状态
};

const authorStyle = {
  color: "blue",
  fontWeight: "bold",
};

function Post({ post, account }) {
  const [likes, setLikes] = useState(post.likes ? post.likes.length : 0);
  const [comments, setComments] = useState(post.comments);
  const [commentContent, setCommentContent] = useState("");
  const [showComments, setShowComments] = useState(false);
  const [hasLiked, setHasLiked] = useState(
    post.likes ? post.likes.includes(account) : false
  );

  const likePost = () => {
    if (hasLiked) return; // 如果已经点赞，不再响应

    axios
      .post(`/api/posts/${post._id}/like`, { user: account })
      .then((response) => {
        setLikes(response.data.likes);
        setHasLiked(true);
      })
      .catch((error) => {
        console.error("点赞失败", error);
      });

    axios
      .post("/api/user-actions", {
        user: account,
        action: "like_post",
        postId: post._id,
      })
      .catch((error) => {
        console.error("发送用户行为数据失败", error);
      });
  };

  const submitComment = () => {
    const newComment = {
      author: account,
      content: commentContent,
    };
    axios
      .post(`/api/posts/${post._id}/comment`, newComment)
      .then((response) => {
        setComments(response.data.comments);
        setCommentContent("");
      })
      .catch((error) => {
        console.error("评论失败", error);
      });

    axios
      .post("/api/user-actions", {
        user: account,
        action: "comment_post",
        postId: post._id,
      })
      .catch((error) => {
        console.error("发送用户行为数据失败", error);
      });
  };

  return (
    <>
      {post.content && (
        <Card style={cardStyle}>
          <p>{post.content}</p>
          <p>
            Author：<span style={authorStyle}>{post.author}</span>
          </p>
          <Button
            type="text"
            onClick={likePost}
            style={hasLiked ? activeButtonStyle : buttonStyle}
            icon={hasLiked ? <LikeFilled /> : <LikeOutlined />}
          >
            {likes > 0 ? likes : ""}
          </Button>
          <Button
            type="text"
            onClick={() => setShowComments(!showComments)}
            style={showComments ? activeButtonStyle : buttonStyle}
            icon={<CommentOutlined />}
          >
            {comments ? comments.length : 0}
          </Button>
          {showComments && (
            <div style={{ marginTop: "10px" }}>
              {comments.map((comment, index) => (
                <Card
                  key={index}
                  type="inner"
                  title={<span style={authorStyle}>{comment.author}</span>}
                  style={{ marginBottom: "10px" }}
                >
                  {comment.content}
                </Card>
              ))}
              <Input.TextArea
                rows={2}
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                placeholder="Say Something..."
                style={{ marginTop: "10px" }}
              />
              <Button
                type="primary"
                onClick={submitComment}
                style={{
                  ...buttonStyle,
                  backgroundColor: "#9333ea",
                  color: "white",
                  marginTop: "10px",
                }}
              >
                Post
              </Button>
            </div>
          )}
        </Card>
      )}
    </>
  );
}

export default Post;
