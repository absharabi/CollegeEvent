import React, { useContext } from "react";
import { Routes, Route, Outlet } from "react-router-dom";

// 🔹 Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import EventDetails from "./pages/EventDetails";
import AddEvent from "./pages/AddEvent";
import EditEvent from "./pages/EditEvent";
import FeedbackForm from "./pages/FeedbackForm";

// 🔹 Components
import Navbar from "./components/Navbar";
import PrivateRoute from "./components/PrivateRoute";

// 🔹 Context
import { AuthContext } from "./context/AuthContext";

// 🔹 Styles
import "./styles/global.css";
import "./styles/Admin.css";

function App() {
  const { user } = useContext(AuthContext);

  return (
    <>
      {/* Navbar always visible */}
      <Navbar />

      <Routes>
        {/* ----------------------- PUBLIC ROUTES ----------------------- */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/events/:id" element={<EventDetails />} />

        {/* ----------------------- STUDENT ROUTES ----------------------- */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute allowedRoles={["student"]}>
              <Dashboard />
            </PrivateRoute>
          }
        />

        {/* Student Feedback Form */}
        <Route
          path="/feedback/:eventId"
          element={
            <PrivateRoute allowedRoles={["student"]}>
              <FeedbackForm />
            </PrivateRoute>
          }
        />

        {/* ----------------------- ADMIN ROUTES ----------------------- */}
        <Route
          element={
            <PrivateRoute allowedRoles={["admin"]}>
              {/* This acts as a layout or wrapper for all admin routes */}
              <Outlet /> 
            </PrivateRoute>
          }
        >
          {/* Nested Admin Routes */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/add-event" element={<AddEvent />} />
          <Route path="/admin/edit-event/:id" element={<EditEvent />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
