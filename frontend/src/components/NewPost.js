import React, { useState } from "react";
import { Input, Button } from "antd";
import axios from "axios";

const containerStyle = {
  backgroundColor: "white",
  padding: "20px",
  borderRadius: "8px",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  marginBottom: "20px",
};

const buttonStyle = {
  backgroundColor: "#9333ea",
  borderColor: "#9333ea",
  color: "white",
  marginTop: "10px",
};

function NewPost({ account, fetchPosts }) {
  const [content, setContent] = useState("");

  const submitPost = () => {
    const newPost = {
      author: account,
      content,
      likes: 0,
      comments: [],
    };

    // 发送到后端
    axios
      .post("/api/posts", newPost)
      .then((response) => {
        setContent("");
        fetchPosts(1);

        // 在发布帖子成功后，发送用户行为数据
        axios
          .post("/api/user-actions", {
            user: account,
            action: "create_post",
            postId: response.data._id, // 使用正确的 response
          })
          .then(() => {
            /* 可以选择性地处理成功情况 */
          })
          .catch((error) => {
            console.error("发送用户行为数据失败", error);
          });
      })
      .catch((error) => {
        console.error("发布帖子失败", error);
      });
  };

  return (
    <div style={containerStyle}>
      <Input.TextArea
        rows={4}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Say Something..."
      />
      <Button type="primary" onClick={submitPost} style={buttonStyle}>
        Post
      </Button>
    </div>
  );
}

export default NewPost;
