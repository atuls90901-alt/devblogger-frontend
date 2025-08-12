import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import Context from "./Context";
import API_BASE_URL from "../congig"; // Import your base API URL

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const { auth } = useContext(Context);

  // Build full image URL
  const getFullImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith("http")) return path;
    if (path.startsWith("/uploads")) return `${API_BASE_URL}${path}`;
    return `${API_BASE_URL}/uploads/${path}`;
  };

  // Fetch all users
  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/users`, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  // Fetch all posts
  const fetchPosts = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/all`);
      setPosts(res.data);
    } catch (err) {
      console.error("Error fetching posts:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchPosts();
  }, []);

  // Block/Unblock user
  const handleBlockUser = async (id) => {
    try {
      await axios.put(
        `${API_BASE_URL}/block/${id}`,
        {},
        { headers: { Authorization: `Bearer ${auth.token}` } }
      );
      fetchUsers();
    } catch (err) {
      console.error("Error blocking user:", err);
    }
  };

  // Delete user
  const handleDeleteUser = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/user/${id}`, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      fetchUsers();
      fetchPosts();
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  };

  // Delete post
  const handleDeletePost = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/post/${id}`, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      setPosts(posts.filter((p) => p._id !== id));
    } catch (err) {
      console.error("Error deleting post:", err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      <h2 className="text-4xl font-extrabold text-center text-gray-800">
        Admin Dashboard
      </h2>

      {/* Admin Profile */}
      {auth.user && (
        <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-200 flex items-center space-x-4">
          <img
            src={
              getFullImageUrl(auth.user.photo) ||
              "https://via.placeholder.com/100"
            }
            alt={auth.user.name}
            className="w-20 h-20 rounded-full object-cover border"
          />
          <div>
            <h3 className="text-xl font-semibold">{auth.user.name}</h3>
            <p className="text-gray-600">{auth.user.email}</p>
            <span className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-full">
              {auth.user.role}
            </span>
          </div>
        </div>
      )}

      {/* Users Section */}
      <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-200">
        <h3 className="text-2xl font-semibold mb-4 text-gray-700">
          Manage Users
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 rounded-lg">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="py-3 px-4 border-b">Photo</th>
                <th className="py-3 px-4 border-b">Name</th>
                <th className="py-3 px-4 border-b">Email</th>
                <th className="py-3 px-4 border-b">Role</th>
                <th className="py-3 px-4 border-b">Status</th>
                <th className="py-3 px-4 border-b text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users
                .filter((user) => user._id !== auth.user?._id)
                .map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50">
                    <td className="py-2 px-4 border-b">
                      {user.photo ? (
                        <img
                          src={getFullImageUrl(user.photo)}
                          alt={user.name}
                          className="w-10 h-10 rounded-full object-cover border"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600">
                          N/A
                        </div>
                      )}
                    </td>
                    <td className="py-2 px-4 border-b">{user.name}</td>
                    <td className="py-2 px-4 border-b">{user.email}</td>
                    <td className="py-2 px-4 border-b capitalize">
                      {user.role}
                    </td>
                    <td className="py-2 px-4 border-b">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          user.isBlocked
                            ? "bg-red-100 text-red-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {user.isBlocked ? "Blocked" : "Active"}
                      </span>
                    </td>
                    <td className="py-2 px-4 border-b text-center">
                      <button
                        onClick={() => handleBlockUser(user._id)}
                        className="bg-yellow-500 text-white px-3 py-1 rounded mr-2 hover:bg-yellow-600 transition"
                      >
                        {user.isBlocked ? "Unblock" : "Block"}
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user._id)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Posts Section */}
      <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-200">
        <h3 className="text-2xl font-semibold mb-4 text-gray-700">
          Manage Posts
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <div
              key={post._id}
              className="border rounded-xl shadow-sm p-4 bg-gray-50 flex flex-col hover:shadow-md transition"
            >
              <h4 className="text-lg font-semibold text-gray-800 mb-2">
                {post.title}
              </h4>
              {post.image ? (
                <img
                  src={getFullImageUrl(post.image)}
                  alt={post.title}
                  className="rounded-md mb-3 h-32 w-full object-cover"
                />
              ) : (
                <div className="h-32 w-full bg-gray-200 flex items-center justify-center text-gray-500">
                  No Image
                </div>
              )}
              <p className="text-gray-600 text-sm mb-3">{post.content}</p>
              <button
                onClick={() => handleDeletePost(post._id)}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition mt-auto"
              >
                Delete Post
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
