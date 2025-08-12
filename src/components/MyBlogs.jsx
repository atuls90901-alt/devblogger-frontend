import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { FaEdit, FaTrash, FaCheck, FaTimes } from "react-icons/fa";
import Context from "./Context";
import API_BASE_URL from "../congig"; // ✅ Centralized API URL

const placeholderPhoto = "https://via.placeholder.com/150";

const getImageUrl = (url) => {
  if (!url) return null;
  return url.startsWith("http") ? url : `${API_BASE_URL}${url}`;
};

const MyBlogs = () => {
  const [posts, setPosts] = useState([]);
  const [editingPost, setEditingPost] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editImage, setEditImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const { auth } = useContext(Context);

  const fetchMyPosts = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/my`, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      setPosts(res.data);
    } catch (err) {
      console.error("Error fetching posts:", err);
    }
  };

  useEffect(() => {
    fetchMyPosts();
  }, [auth.token]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/delete/${id}`, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      setPosts(posts.filter((p) => p._id !== id));
    } catch (err) {
      console.error("Error deleting post:", err);
    }
  };

  const handleEdit = (post) => {
    setEditingPost(post._id);
    setEditTitle(post.title);
    setEditContent(post.content);
    setEditImage(null);
    setImagePreview(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setEditImage(file);
    setImagePreview(file ? URL.createObjectURL(file) : null);
  };

  const handleSave = async (id) => {
    try {
      const formData = new FormData();
      formData.append("title", editTitle);
      formData.append("content", editContent);
      if (editImage) formData.append("image", editImage);

      await axios.put(`${API_BASE_URL}/update/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setEditingPost(null);
      fetchMyPosts();
    } catch (err) {
      console.error("Error updating post:", err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6 text-center">My Blogs</h2>
      {posts.length === 0 ? (
        <p className="text-center text-gray-500">No posts found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {posts.map((post) => (
            <div
              key={post._id}
              className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200 hover:shadow-xl transition"
            >
              {editingPost === post._id ? (
                <div className="p-4">
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full p-2 border rounded mb-2"
                  />
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="w-full p-2 border rounded mb-2"
                  />
                  <input
                    type="file"
                    onChange={handleImageChange}
                    accept="image/*"
                    className="mb-2"
                  />
                  {imagePreview && (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded mb-2"
                    />
                  )}
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => handleSave(post._id)}
                      className="bg-green-500 text-white p-2 rounded hover:bg-green-600"
                    >
                      <FaCheck />
                    </button>
                    <button
                      onClick={() => setEditingPost(null)}
                      className="bg-gray-400 text-white p-2 rounded hover:bg-gray-500"
                    >
                      <FaTimes />
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {post.image && (
                    <img
                      src={getImageUrl(post.image) || placeholderPhoto}
                      alt={post.title}
                      className="w-full h-64 object-cover"
                    />
                  )}
                  <div className="p-4">
                    <h3 className="text-lg font-semibold mb-2">{post.title}</h3>
                    <p className="text-gray-700 mb-3">{post.content}</p>
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleEdit(post)}
                        className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(post._id)}
                        className="bg-red-500 text-white p-2 rounded hover:bg-red-600"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBlogs;
