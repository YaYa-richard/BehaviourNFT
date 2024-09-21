// src/components/Forum.js
import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import Post from "./Post";
import NewPost from "./NewPost";
import axios from "axios";
import { Input } from "antd";

function Forum({ account }) {
    const [posts, setPosts] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        // 从后端获取帖子列表，支持搜索
        axios
            .get("/api/posts", { params: { search: searchTerm } })
            .then((response) => {
                setPosts(response.data);
            })
            .catch((error) => {
                console.error("获取帖子失败", error);
            });
    }, [searchTerm]);

    const handleSearch = (value) => {
        // 更新搜索词
        setSearchTerm(value);

        // 记录用户行为
        axios
            .post("/api/user-actions", {
                user: account,
                action: "search",
                keyword: value,
            })
            .then(() => {
                // 可以选择性地处理成功情况
                console.log("用户行为数据已发送");
            })
            .catch((error) => {
                console.error("发送用户行为数据失败", error);
            });
    };

    return (
        <div>
            <Navbar account={account} />
            <NewPost account={account} setPosts={setPosts} />
            {/* 添加搜索输入框 */}
            <Input.Search
                placeholder="搜索帖子"
                onSearch={handleSearch} // 使用handleSearch函数
                style={{ width: 200, margin: "20px" }}
            />
            {posts.map((post) => (
                <Post key={post._id} post={post} account={account} />
            ))}
        </div>
    );
}

export default Forum;
