import { createContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import API_BASE_URL from "../congig"; // ✅ import API base URL

const Context = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    token: Cookies.get("token") || "",
    user: JSON.parse(localStorage.getItem("user")) || null,
  });

  const fetchUser = async () => {
    if (auth.token) {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/user`, {
          headers: { Authorization: `Bearer ${auth.token}` },
        });
        setAuth((prev) => ({ ...prev, user: res.data }));
        localStorage.setItem("user", JSON.stringify(res.data));
      } catch (err) {
        console.error("Error fetching user:", err);
        setAuth({ token: "", user: null });
        Cookies.remove("token");
        localStorage.removeItem("user");
      }
    }
  };

  const updateProfile = async (formData) => {
    try {
      const res = await axios.patch(`${API_BASE_URL}/api/user`, formData, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setAuth((prev) => ({ ...prev, user: res.data.user }));
      localStorage.setItem("user", JSON.stringify(res.data.user));
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || "Failed to update profile");
    }
  };

  const logout = () => {
    setAuth({ token: "", user: null });
    Cookies.remove("token");
    localStorage.removeItem("user");
  };

  useEffect(() => {
    fetchUser();
  }, [auth.token]);

  return (
    <Context.Provider value={{ auth, setAuth, updateProfile, logout }}>
      {children}
    </Context.Provider>
  );
};

export default Context;
