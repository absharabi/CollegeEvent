import React, { useContext } from "react";
import { Routes, Route } from "react-router-dom"; // ❌ Removed BrowserRouter here
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import EventDetails from "./pages/EventDetails";
import AddEvent from "./pages/AddEvent";
import Navbar from "./components/Navbar";
import PrivateRoute from "./components/PrivateRoute";
import { AuthContext, AuthProvider } from "./context/AuthContext";
import "./styles/global.css";

function App() {
  const { user } = useContext(AuthContext);

  return (
    <>
      <Navbar />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute isAuthenticated={!!user}>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/add-event"
          element={
            <PrivateRoute isAuthenticated={!!user}>
              <AddEvent />
            </PrivateRoute>
          }
        />
        <Route path="/events/:id" element={<EventDetails />} />
      </Routes>
    </>
  );
}

// ✅ Wrap with AuthProvider only
export default function AppWithProvider() {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
}
