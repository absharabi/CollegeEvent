import React, { createContext, useState, useEffect } from "react";
import api from "../services/api"; // We'll create this service next

// 1. Create the context
export const AuthContext = createContext();

// 2. Create the provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 3. Check for user on initial load
  useEffect(() => {
    const loadUser = () => {
      try {
        const storedToken = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");

        if (storedToken && storedUser) {
          // Set the user from localStorage
          setUser(JSON.parse(storedUser));
          // IMPORTANT: Set the auth token for all future API requests
          api.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
        }
      } catch (error) {
        console.error("Failed to load user from localStorage", error);
        // Clear potentially corrupted storage
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // 4. Login function
  const login = (userData) => {
    const { token, user: userObject } = userData;

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userObject));

    // Set the user state
    setUser(userObject);

    // Set auth token for future requests
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  };

  // 5. Logout function
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    delete api.defaults.headers.common["Authorization"];
  };

  // 6. Provide the context value to children
  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};