import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import Context from "./Context";
import API_BASE_URL from "../congig"; // ✅ Use centralized API URL

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState({});
  const { auth } = useContext(Context);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/all`);
        setPosts(res.data);

        if (auth.token) {
          const payload = JSON.parse(atob(auth.token.split(".")[1]));
          const userId = payload.id || payload.sub;
          const initialLiked = {};
          res.data.forEach((post) => {
            initialLiked[post._id] = userId && post.likes.includes(userId);
          });
          setLikedPosts(initialLiked);
        }
      } catch (err) {
        console.error("Error fetching posts:", err);
      }
    };
    fetchPosts();
  }, [auth.token]);

  const toggleLike = async (postId) => {
    if (!auth.token) {
      alert("Please login to like this post.");
      return;
    }
    try {
      const res = await axios.post(
        `${API_BASE_URL}/like/${postId}`,
        {},
        { headers: { Authorization: `Bearer ${auth.token}` } }
      );
      setLikedPosts((prev) => ({
        ...prev,
        [postId]: res.data.liked,
      }));
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId
            ? { ...post, likes: new Array(res.data.totalLikes).fill("user") }
            : post
        )
      );
    } catch (err) {
      console.error("Error liking post:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 px-4">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Latest Stories
        </h2>

        {posts.length === 0 ? (
          <p className="text-center text-gray-400 text-base animate-pulse">
            No stories to show.
          </p>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <div
                key={post._id}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                {/* Header */}
                <div className="flex items-center p-3 border-b border-gray-200">
                  <img
                    src={
                      post.author?.photo ||
                      "https://via.placeholder.com/32"
                    }
                    alt={post.author?.name || "Author"}
                    className="w-8 h-8 rounded-full object-cover border border-gray-300"
                  />
                  <div className="ml-2">
                    <p className="text-sm font-semibold text-gray-800">
                      {post.author?.name || "Unknown"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Blog Image */}
                {post.image && (
                  <Link to={`/blog/${post._id}`}>
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-64 object-cover"
                    />
                  </Link>
                )}

                {/* Content */}
                <div className="p-3">
                  <div className="flex items-center justify-between mb-2">
                    <button
                      onClick={() => toggleLike(post._id)}
                      className={`flex items-center space-x-1 text-gray-600 hover:text-red-500 transition duration-200 transform hover:scale-110 ${
                        likedPosts[post._id] ? "text-red-500" : ""
                      }`}
                    >
                      {likedPosts[post._id] ? (
                        <AiFillHeart className="text-xl" />
                      ) : (
                        <AiOutlineHeart className="text-xl" />
                      )}
                      <span className="text-sm">{post.likes.length}</span>
                    </button>
                    <Link
                      to={`/blog/${post._id}`}
                      className="text-blue-500 hover:text-blue-600 text-sm font-semibold"
                    >
                      View Comments
                    </Link>
                  </div>
                  <h3 className="text-base font-semibold text-gray-800 mb-1">
                    <Link
                      to={`/blog/${post._id}`}
                      className="hover:text-blue-600 transition"
                    >
                      {post.title}
                    </Link>
                  </h3>
                  <p className="text-gray-600 text-sm line-clamp-2">
                    {post.content}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
