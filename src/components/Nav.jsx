import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Context from "./Context";
import "../App.css";

const Nav = () => {
  const { auth, logout } = useContext(Context);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
    navigate("/login");
  };

  return (
    <nav className="flex flex-wrap justify-between items-center bg-gray-900 text-white px-6 py-4 shadow-lg">
      <div className="flex items-center space-x-6 text-lg">
        <Link to="/" className="hover:text-yellow-400 transition duration-200 font-medium">Home</Link>

        {!auth.token && (
          <>
            <Link to="/register" className="hover:text-yellow-400 transition duration-200 font-medium">Register</Link>
            <Link to="/login" className="hover:text-yellow-400 transition duration-200 font-medium">Login</Link>
          </>
        )}

        {auth.token && (
          <>
            <Link to="/add-blog" className="hover:text-yellow-400 transition duration-200 font-medium">Add Blog</Link>
            <Link to="/my-blogs" className="hover:text-yellow-400 transition duration-200 font-medium">My Blogs</Link>
          </>
        )}

        {auth.user?.role === "admin" && (
          <Link to="/admin" className="hover:text-yellow-400 transition duration-200 font-medium">Admin Dashboard</Link>
        )}
      </div>

      {auth.user && (
        <div className="mt-2 sm:mt-0 flex items-center space-x-2 text-sm sm:text-base relative">
          <span className="text-gray-400">Hello,</span>
          <button
            onClick={toggleDropdown}
            className="font-semibold text-yellow-300 hover:text-yellow-400 transition duration-200 focus:outline-none"
          >
            {auth.user.name}
          </button>
          {isDropdownOpen && (
            <div className="absolute top-full right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg z-10">
              <Link
                to="/profile"
                className="block px-4 py-2 text-white hover:bg-gray-700 hover:text-yellow-400 transition duration-200"
                onClick={() => setIsDropdownOpen(false)}
              >
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-white hover:bg-gray-700 hover:text-yellow-400 transition duration-200"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Nav;