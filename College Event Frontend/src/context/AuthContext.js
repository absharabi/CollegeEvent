import React, { createContext, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null); // ✅ added
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Load user + token from localStorage on refresh
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      const storedToken = localStorage.getItem("token");

      if (
        storedUser &&
        storedUser !== "undefined" &&
        storedUser !== "null" &&
        storedToken
      ) {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
      } else {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        setUser(null);
        setToken(null);
      }
    } catch (err) {
      console.error("Error parsing user data:", err);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      setUser(null);
      setToken(null);
    }
  }, []);

  // ✅ Handle login + role-based redirect
  const login = ({ user, token }) => {
    if (!user || !token) return;

    setUser(user);
    setToken(token);
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", token);

    // Role-based redirect
    setTimeout(() => {
      if (user.role === "admin") navigate("/admin/dashboard");
      else if (user.role === "organizer") navigate("/organizer/dashboard");
      else if (user.role === "student") navigate("/dashboard");
      else navigate("/");
    }, 100);
  };

  // ✅ Logout
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    if (location.pathname !== "/login") navigate("/login");
  };

  // ✅ Auth headers for API calls
  const getAuthHeaders = () => {
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, getAuthHeaders }}>
      {children}
    </AuthContext.Provider>
  );
};
