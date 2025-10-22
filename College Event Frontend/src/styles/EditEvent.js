import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import api from "../../services/api";
import { AuthContext } from "../../context/AuthContext";

const EditEvent = () => {
  const { id } = useParams(); // Get event ID from URL
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    category: "Tech",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await api.get(`/events/${id}`);
        const eventData = response.data;
        // The date from the DB needs to be in 'YYYY-MM-DD' format for the input[type="date"]
        const formattedDate = new Date(eventData.date)
          .toISOString()
          .split("T")[0];
        setFormData({ ...eventData, date: formattedDate });
      } catch (err) {
        setError("Failed to fetch event data.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (user?.role !== "admin" && user?.role !== "organizer") {
      setError("You are not authorized to edit events.");
      return;
    }

    try {
      await api.put(`/events/${id}`, formData);
      setSuccess("Event updated successfully! Redirecting to dashboard...");
      setTimeout(() => {
        navigate("/admin/dashboard");
      }, 2000);
    } catch (err) {
      setError(
        err.response?.data?.error || "Failed to update event. Please try again."
      );
      console.error(err);
    }
  };

  if (loading) return <p>Loading event...</p>;

  return (
    <div className="admin-container">
      <Link to="/admin/dashboard" className="back-link">
        &larr; Back to Dashboard
      </Link>
      <div className="form-container">
        <h2>Edit Event</h2>
        <form onSubmit={handleSubmit}>
          <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="Event Title" required />
          <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Event Description" required />
          <input type="date" name="date" value={formData.date} onChange={handleChange} required />
          <input type="text" name="location" value={formData.location} onChange={handleChange} placeholder="Location" required />
          <select name="category" value={formData.category} onChange={handleChange}>
            <option value="Tech">Tech</option>
            <option value="Cultural">Cultural</option>
            <option value="Sports">Sports</option>
          </select>
          {error && <p className="error-msg">{error}</p>}
          {success && <p className="success-msg">{success}</p>}
          <button type="submit">Update Event</button>
        </form>
      </div>
    </div>
  );
};

export default EditEvent;