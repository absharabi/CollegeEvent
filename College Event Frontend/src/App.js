import React, { useContext } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import EventDetails from "./pages/EventDetails";
import Navbar from "./components/Navbar";
import PrivateRoute from "./components/PrivateRoute";
import { AuthContext, AuthProvider } from "./context/AuthContext";
import "./styles/global.css";

function App() {
  const { user } = useContext(AuthContext); // get user from context

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Route */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute isAuthenticated={!!user}>
              <Dashboard />
            </PrivateRoute>
          }
        />

        <Route path="/events/:id" element={<EventDetails />} />
      </Routes>
    </>
  );
}

// Wrap App with AuthProvider
export default function AppWithProvider() {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
}
