import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "./src/context/AuthContext.js";

/**
 * Protects routes based on login and optional role.
 * @param {ReactNode} children - The component to render.
 * @param {Array<string>} allowedRoles - Roles allowed to access the route.
 */
const PrivateRoute = ({ children, allowedRoles }) => {
  const { user } = useContext(AuthContext);

  // 1️⃣ If user not logged in → redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 2️⃣ If user role not allowed → redirect to unauthorized page or home
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // 3️⃣ Otherwise → render the protected component
  return children;
};

export default PrivateRoute;
