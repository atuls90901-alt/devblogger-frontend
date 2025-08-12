import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import Context from "./Context";

const ProtectedRoute = ({ children, role }) => {
  const { auth } = useContext(Context);

  if (!auth.token) {
    return <Navigate to="/login" replace />;
  }

  if (role && auth.user?.role !== role) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;