// src/components/Post.js
import React, { useState } from "react";
import { Card, Button, Input } from "antd";
import axios from "axios";
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
                <Card style={{ margin: "20px" }}>
                    <p>{post.content}</p>
                    <p>作者：{post.author}</p>
                    <Button type="link" onClick={likePost}>
                        点赞 ({likes})
                    </Button>
                    <Button
                        type="link"
                        onClick={() => setShowComments(!showComments)}
                    >
                        评论 ({comments ? comments.length : 0})
                    </Button>
                    {showComments && (
                        <div style={{ marginTop: "10px" }}>
                            {comments.map((comment, index) => (
                                <Card
                                    key={index}
                                    type="inner"
                                    title={comment.author}
                                >
                                    {comment.content}
                                </Card>
                            ))}
                            <Input.TextArea
                                rows={2}
                                value={commentContent}
                                onChange={(e) =>
                                    setCommentContent(e.target.value)
                                }
                                placeholder="输入评论..."
                                style={{ marginTop: "10px" }}
                            />
                            <Button
                                type="primary"
                                onClick={submitComment}
                                style={{ marginTop: "10px" }}
                            >
                                提交评论
                            </Button>
                        </div>
                    )}
                </Card>
            )}
        </>
    );
}
export default Post;
