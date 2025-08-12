import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import Context from "./Context";

const API_URL = "http://localhost:5000";

const BlogDetails = () => {
  const { id } = useParams();
  const { auth } = useContext(Context);
  const [post, setPost] = useState(null);
  const [liked, setLiked] = useState(false);
  const [commentText, setCommentText] = useState("");

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(`${API_URL}/blog/${id}`);
        setPost(res.data);

        // Determine if current user liked it
        if (auth.token) {
          const payload = JSON.parse(atob(auth.token.split(".")[1]));
          const userId = payload.id || payload.sub;
          setLiked(res.data.likes.includes(userId));
        }
      } catch (err) {
        console.error("Error fetching post:", err);
      }
    };
    fetchPost();
  }, [id, auth.token]);

  const toggleLike = async () => {
    if (!auth.token) {
      alert("Please login to like this post.");
      return;
    }
    try {
      const res = await axios.post(
        `${API_URL}/like/${id}`,
        {},
        { headers: { Authorization: `Bearer ${auth.token}` } }
      );
      setLiked(res.data.liked);
      setPost((prev) => ({
        ...prev,
        likes: new Array(res.data.totalLikes).fill("user"), // just for count display
      }));
    } catch (err) {
      console.error("Error liking post:", err);
    }
  };

  const handleComment = async () => {
    if (!auth.token) {
      alert("Please login to comment.");
      return;
    }
    try {
      await axios.post(
        `${API_URL}/comment/${id}`,
        { text: commentText },
        { headers: { Authorization: `Bearer ${auth.token}` } }
      );
      setCommentText("");
      const res = await axios.get(`${API_URL}/blog/${id}`);
      setPost(res.data);
    } catch (err) {
      console.error("Error adding comment:", err);
    }
  };

  if (!post) {
    return <p className="text-center">Loading...</p>;
  }

  return (
    <div className="max-w-xl mx-auto bg-white rounded-lg shadow-md overflow-hidden mt-6">
      {/* Author */}
      <div className="flex items-center p-4 border-b border-gray-200">
        <img
          src={post.author?.photo || "https://via.placeholder.com/40"}
          alt={post.author?.name || "Author"}
          className="w-10 h-10 rounded-full object-cover border border-gray-300"
        />
        <div className="ml-3">
          <p className="font-semibold text-gray-800">{post.author?.name}</p>
          <p className="text-xs text-gray-500">
            {new Date(post.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Image */}
      {post.image && (
        <img src={post.image} alt={post.title} className="w-full object-cover" />
      )}

      {/* Actions */}
      <div className="p-4">
        <button
          onClick={toggleLike}
          className={`flex items-center space-x-1 text-gray-700 hover:scale-110 transition-transform duration-150 ${
            liked ? "text-red-500" : ""
          }`}
        >
          {liked ? (
            <AiFillHeart className="text-2xl" />
          ) : (
            <AiOutlineHeart className="text-2xl" />
          )}
        </button>
        <p className="text-sm font-semibold mt-1">
          {post.likes.length} {post.likes.length === 1 ? "like" : "likes"}
        </p>

        {/* Content */}
        <h1 className="text-lg font-semibold mt-2">{post.title}</h1>
        <p className="text-gray-700 text-sm">{post.content}</p>
      </div>

      {/* Comments */}
      <div className="px-4 pb-4">
        <h3 className="text-sm font-semibold mb-2">Comments</h3>
        {post.comments.length === 0 ? (
          <p className="text-gray-500 text-sm">No comments yet.</p>
        ) : (
          <div className="space-y-3 max-h-48 overflow-y-auto">
            {post.comments.map((c, idx) => (
              <div key={idx} className="flex items-start">
                <img
                  src={c.user?.photo || "https://via.placeholder.com/32"}
                  alt={c.user?.name || "User"}
                  className="w-8 h-8 rounded-full object-cover border border-gray-300"
                />
                <div className="ml-2">
                  <p className="text-sm font-semibold">{c.user?.name}</p>
                  <p className="text-gray-600 text-sm">{c.text}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add Comment */}
        <div className="mt-4 flex border border-gray-300 rounded-lg overflow-hidden">
          <input
            type="text"
            placeholder="Add a comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            className="flex-1 px-3 py-2 text-sm outline-none"
          />
          <button
            onClick={handleComment}
            className="bg-blue-500 text-white px-4 py-2 text-sm font-semibold hover:bg-blue-600"
          >
            Post
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlogDetails;
