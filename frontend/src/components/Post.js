// src/components/Post.js
import React, { useState } from "react";
import { Card, Button, Input } from "antd";
import axios from "axios";

const cardStyle = {
  margin: "20px 0",
  borderRadius: "8px",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
};

const buttonStyle = {
  color: "#9333ea",
};

function Post({ post, account }) {
  const [likes, setLikes] = useState(post.likes);
  const [comments, setComments] = useState(post.comments);
  const [commentContent, setCommentContent] = useState("");
  const [showComments, setShowComments] = useState(false);
  const likePost = () => {
    axios
      .post(`/api/posts/${post._id}/like`, { user: account })
      .then((response) => {
        setLikes(response.data.likes);
      })
      .catch((error) => {
        console.error("点赞失败", error);
      });
    // 在likePost函数中
    axios
      .post("/api/user-actions", {
        user: account,
        action: "like_post",
        postId: post._id,
      })
      .then(() => {
        /* 可以选择性地处理成功情况 */
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
    // 在submitComment函数中
    axios
      .post("/api/user-actions", {
        user: account,
        action: "comment_post",
        postId: post._id,
      })
      .then(() => {
        /* 可以选择性地处理成功情况 */
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
          <p>Author：{post.author}</p>
          <Button type="link" onClick={likePost} style={buttonStyle}>
            Likes ({likes})
          </Button>
          <Button
            type="link"
            onClick={() => setShowComments(!showComments)}
            style={buttonStyle}
          >
            Comments ({comments ? comments.length : 0})
          </Button>
          {showComments && (
            <div style={{ marginTop: "10px" }}>
              {comments.map((comment, index) => (
                <Card
                  key={index}
                  type="inner"
                  title={comment.author}
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
