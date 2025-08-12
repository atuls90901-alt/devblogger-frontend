import { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import Context from "../components/Context";

const Logout = () => {
  const { setAuth } = useContext(Context);
  const navigate = useNavigate();

  useEffect(() => {
    // Clear authentication data
    setAuth({ token: "", user: null });
    Cookies.remove("token");
    localStorage.removeItem("user");

    // Redirect to login page
    navigate("/login");
  }, [setAuth, navigate]);

  return null; // No UI needed
};

export default Logout;
