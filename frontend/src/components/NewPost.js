import React, { useState } from "react";
import { Input, Button } from "antd";
import axios from "axios";

function NewPost({ account, setPosts }) {
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
                setPosts((prevPosts) => [response.data, prevPosts]);
                setContent("");

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
        <div style={{ padding: "20px" }}>
            <Input.TextArea
                rows={4}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="说点什么吧..."
            />
            <Button
                type="primary"
                onClick={submitPost}
                style={{ marginTop: "10px" }}
            >
                发布
            </Button>
        </div>
    );
}

export default NewPost;
