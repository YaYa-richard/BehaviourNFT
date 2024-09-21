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

const contentStyle = {
  backgroundColor: "white",
  padding: "20px",
  borderRadius: "8px",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
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
  const [userProfile, setUserProfile] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [inputSearchTerm, setInputSearchTerm] = useState(""); // 新增：用于存储输入框中的搜索词
  const postsPerPage = 10;

  const fetchUserProfile = () => {
    axios
      .get(`/api/users/${account}`)
      .then((response) => {
        if (response.data) {
          setUserProfile(response.data);
        } else {
          setUserProfile(null);
        }
      })
      .catch((error) => {
        console.error("获取用户画像失败", error);
        setUserProfile(null);
      });
  };

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
    fetchUserProfile();
  }, [searchTerm, currentPage]);

  const handleSearch = (value) => {
    setSearchTerm(value);
    setCurrentPage(1);
    setIsSearching(!!value);

    if (value) {
      axios
        .post("/api/user-actions", {
          user: account,
          action: "search",
          keyword: value,
        })
        .catch((error) => {
          console.error("发送用户行为数据失败", error);
        });
    }
  };

  const handleInputChange = (e) => {
    setInputSearchTerm(e.target.value);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleReset = () => {
    setSearchTerm("");
    setInputSearchTerm("");
    setIsSearching(false);
    setCurrentPage(1);
    fetchPosts(1, "");
  };

  return (
    <div style={containerStyle}>
      <Navbar account={account} />
      <div style={contentStyle}>
        <NewPost account={account} fetchPosts={() => fetchPosts(1)} />
        <div style={searchContainerStyle}>
          <Input.Search
            placeholder="Search Posts"
            onSearch={handleSearch}
            style={{ width: 200, marginRight: 10 }}
            value={inputSearchTerm}
            onChange={handleInputChange}
            enterButton
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
              Return
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
    </div>
  );
}

export default Forum;
