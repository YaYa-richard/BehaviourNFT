import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import Post from "./Post";
import NewPost from "./NewPost";
import axios from "axios";
import { Input, Pagination, Button } from "antd";

const containerStyle = {
  backgroundColor: "#f3e8ff",
  minHeight: "100vh",
  padding: "20px",
};

const searchContainerStyle = {
  display: "flex",
  alignItems: "center",
  margin: "20px 0",
};

function Forum({ account }) {
  const [posts, setPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);
  const [isSearching, setIsSearching] = useState(false); // 新增状态
  const postsPerPage = 10;

  const fetchPosts = (page, search = "") => {
    axios
      .get("/api/posts", {
        params: {
          search: search,
          page: page,
          limit: postsPerPage,
        },
      })
      .then((response) => {
        setPosts(response.data.posts);
        setTotalPosts(response.data.total);
      })
      .catch((error) => {
        console.error("获取帖子失败", error);
      });
  };

  useEffect(() => {
    fetchPosts(currentPage, searchTerm);
  }, [searchTerm, currentPage]);

  const handleSearch = (value) => {
    setSearchTerm(value);
    setCurrentPage(1);
    setIsSearching(true); // 设置搜索状态

    axios
      .post("/api/user-actions", {
        user: account,
        action: "search",
        keyword: value,
      })
      .catch((error) => {
        console.error("发送用户行为数据失败", error);
      });
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleReset = () => {
    setSearchTerm("");
    setIsSearching(false);
    setCurrentPage(1);
    fetchPosts(1, "");
  };

  return (
    <div style={containerStyle}>
      <Navbar account={account} />
      <NewPost account={account} fetchPosts={() => fetchPosts(1)} />
      <div style={searchContainerStyle}>
        <Input.Search
          placeholder="搜索帖子"
          onSearch={handleSearch}
          style={{ width: 200, marginRight: 10 }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {isSearching && (
          <Button
            onClick={handleReset}
            style={{
              backgroundColor: "#9333ea",
              color: "white",
              border: "none",
            }}
          >
            返回
          </Button>
        )}
      </div>
      {posts.map((post) => (
        <Post key={post._id} post={post} account={account} />
      ))}
      <Pagination
        current={currentPage}
        total={totalPosts}
        pageSize={postsPerPage}
        onChange={handlePageChange}
        style={{ margin: "20px 0", textAlign: "center" }}
      />
    </div>
  );
}

export default Forum;
