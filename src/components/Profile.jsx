import React, { useState, useContext } from "react";
import Context from "./Context"; // Adjust path if needed

const API_URL = "http://localhost:5000";

const Profile = () => {
  const { auth, updateProfile } = useContext(Context);
  const [name, setName] = useState(auth.user?.name || "");
  const [email, setEmail] = useState(auth.user?.email || "");
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Generate full URL for current photo (consistent with MyBlogs.jsx)
  const getImageUrl = (url) => {
    if (!url) return "https://via.placeholder.com/150";
    return url.startsWith("http") ? url : `${API_URL}${url}`;
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email) {
      setError("Name and email are required.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    if (selectedFile) formData.append("photo", selectedFile);

    try {
      const response = await updateProfile(formData);
      setSuccess("Profile updated successfully!");
      setPreview(null);
      setSelectedFile(null);
    } catch (err) {
      setError(err.message || "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  if (!auth.user) {
    return <p className="text-center text-red-500">Please log in to update your profile.</p>;
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6 mt-8">
      <h2 className="text-2xl font-bold mb-4 text-center">Update Profile</h2>
      
      {/* Current Profile Picture */}
      <div className="flex justify-center mb-4">
        <img
          src={getImageUrl(auth.user.photo)}
          alt="Current Profile"
          className="w-32 h-32 rounded-full object-cover border border-gray-300"
        />
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Enter your name"
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Enter your email"
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Profile Picture</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>
        
        {/* Preview */}
        {preview && (
          <div className="flex justify-center mb-4">
            <img
              src={preview}
              alt="Preview"
              className="w-32 h-32 rounded-full object-cover border border-gray-300"
            />
          </div>
        )}
        
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          {loading ? "Updating..." : "Update Profile"}
        </button>
      </form>
      
      {error && <p className="text-red-500 text-center mt-2">{error}</p>}
      {success && <p className="text-green-500 text-center mt-2">{success}</p>}
    </div>
  );
};

export default Profile;