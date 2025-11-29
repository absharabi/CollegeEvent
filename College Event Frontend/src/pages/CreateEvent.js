import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";
import "../styles/Admin.css";

const CreateEvent = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    category: "Tech", // Default category
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const { title, description, date, location, category } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (user?.role !== "admin") {
      setError("You are not authorized to create events.");
      return;
    }

    try {
      await api.post("/events", formData);
      setSuccess("Event created successfully! Redirecting to dashboard...");
      setTimeout(() => {
        navigate("/admin/dashboard");
      }, 2000);
    } catch (err) {
      setError(
        err.response?.data?.error || "Failed to create event. Please try again."
      );
      console.error(err);
    }
  };

  return (
    <div className="admin-container">
      <Link to="/admin/dashboard" className="back-link">
        &larr; Back to Dashboard
      </Link>
      <div className="form-container">
        <h2>Create New Event</h2>
        <form onSubmit={handleSubmit}>
          <input type="text" name="title" value={title} onChange={handleChange} placeholder="Event Title" required />
          <textarea name="description" value={description} onChange={handleChange} placeholder="Event Description" required />
          <input type="date" name="date" value={date} onChange={handleChange} required />
          <input type="text" name="location" value={location} onChange={handleChange} placeholder="Location" required />
          <select name="category" value={category} onChange={handleChange}>
            <option value="Tech">Tech</option>
            <option value="Cultural">Cultural</option>
            <option value="Sports">Sports</option>
          </select>
          {error && <p className="error-msg">{error}</p>}
          {success && <p className="success-msg">{success}</p>}
          <button type="submit">Create Event</button>
        </form>
      </div>
    </div>
  );
};

export default CreateEvent;