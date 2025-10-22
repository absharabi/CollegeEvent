import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import styles from "../styles/Form.module.css"; // Import the CSS module
import api from "../services/api";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { login, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await api.post("/auth/login", { email, password });
      const data = response.data;

      // ✅ Store token & log in via context
      if (data.token && data.user) {
        login({ user: data.user, token: data.token }); // Pass both user and token
      } else {
        setError("Token missing in response");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(err.response?.data?.error || "Server error. Please try again later.");
    }
  };

  // This effect runs when the `user` object in the context changes.
  // When the user successfully logs in, this will navigate them to the correct dashboard.
  useEffect(() => {
    if (user) {
      // Navigate based on user role
      if (user.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/dashboard");
      }
    }
  }, [user, navigate]);

  return (
    <div className={styles.container}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p className={styles.errorMsg}>{error}</p>}
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
