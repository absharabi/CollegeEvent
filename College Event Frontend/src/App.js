import React, { useContext } from "react";
import { Routes, Route, Outlet } from "react-router-dom";

// 🔹 Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import EventDetails from "./pages/EventDetails";
import EventsPage from "./pages/EventsPage";
import CreateEvent from "./pages/CreateEvent";
import EditEvent from "./pages/EditEvent";
import FeedbackForm from "./pages/FeedbackForm";
import EventRegistrations from "./pages/EventRegistrations";
import MyCertificates from "./pages/MyCertificates"; // Import the new page

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
        <Route path="/events" element={<EventsPage />} />
        <Route path="/events/category/:categoryName" element={<EventsPage />} />
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

        <Route
          path="/feedback/:eventId"
          element={
            <PrivateRoute allowedRoles={["student"]}>
              <FeedbackForm />
            </PrivateRoute>
          }
        />

        <Route
          path="/my-certificates"
          element={
            <PrivateRoute allowedRoles={["student"]}>
              <MyCertificates />
            </PrivateRoute>
          }
        />

        {/* ----------------------- ADMIN ROUTES ----------------------- */}
        <Route
          element={
            <PrivateRoute allowedRoles={["admin", "organizer"]}>
              <Outlet />
            </PrivateRoute>
          }
        >
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/add-event" element={<CreateEvent />} />
          <Route path="/admin/edit-event/:id" element={<EditEvent />} />
          <Route
            path="/admin/events/:id/registrations"
            element={<EventRegistrations />}
          />
        </Route>

        {/* ----------------------- FALLBACK ROUTE ----------------------- */}
        <Route
          path="*"
          element={<h2 style={{ textAlign: "center", marginTop: "2rem" }}>404 - Page Not Found</h2>}
        />
      </Routes>
    </>
  );
}

export default App;
