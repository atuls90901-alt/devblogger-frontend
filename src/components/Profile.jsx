import { useContext, useState } from "react";
import Context from "../context/Context"; // your Auth Context
import API_BASE_URL from "../congig";

const Profile = () => {
  const { auth, updateProfile } = useContext(Context);
  const [name, setName] = useState(auth.user?.name || "");
  const [email, setEmail] = useState(auth.user?.email || "");
  const [avatar, setAvatar] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      if (avatar) {
        formData.append("avatar", avatar);
      }

      const res = await updateProfile(formData);
      setMessage("✅ Profile updated successfully!");
      console.log("Updated Profile:", res);
    } catch (err) {
      setMessage(`❌ ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Update Profile</h2>

      {/* Profile Picture */}
      <div className="flex items-center mb-4">
        <img
          src={
            avatar
              ? URL.createObjectURL(avatar)
              : auth.user?.avatar
              ? `${API_BASE_URL}/${auth.user.avatar}`
              : "https://via.placeholder.com/150"
          }
          alt="Profile"
          className="w-20 h-20 rounded-full object-cover border"
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setAvatar(e.target.files[0])}
          className="ml-4"
        />
      </div>

      {/* Update Form */}
      <form onSubmit={handleSubmit}>
        <label className="block mb-2">
          Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border p-2 rounded mt-1"
          />
        </label>

        <label className="block mb-2">
          Email:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border p-2 rounded mt-1"
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          {loading ? "Updating..." : "Update Profile"}
        </button>
      </form>

      {message && <p className="mt-4 text-sm">{message}</p>}
    </div>
  );
};

export default Profile;
