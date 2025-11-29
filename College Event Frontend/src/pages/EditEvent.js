import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../services/api"; // Import the centralized API service

import "../styles/Admin.css"; // Import Admin styles for form consistency
const EditEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [eventData, setEventData] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    category: "Tech",
  });

  useEffect(() => {
    api.get(`/events/${id}`)
      .then((res) => setEventData(res.data))
      .catch((err) => console.error(err));
  }, [id]);

  const handleChange = (e) => {
    setEventData({ ...eventData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/events/${id}`, eventData);
      alert("Event updated successfully!");
      navigate("/admin/dashboard");
    } catch (error) {
      console.error(error);
      alert("Failed to update event");
    }
  };

  return (
    <div className="admin-container">
      <Link to="/admin/dashboard" className="back-link">
        &larr; Back to Dashboard
      </Link>
      <div className="form-container">
        <h2>Edit Event</h2>
        <form onSubmit={handleSubmit}>
        <input
          name="title"
          value={eventData.title}
          onChange={handleChange}
          placeholder="Title"
          required
        />
        <textarea
          name="description"
          value={eventData.description}
          onChange={handleChange}
          placeholder="Description"
          required
        />
        <input
          type="date"
          name="date"
          value={eventData.date}
          onChange={handleChange}
          required
        />
        <input
          name="location"
          value={eventData.location}
          onChange={handleChange}
          placeholder="Location"
          required
        />
        <select
          name="category"
          value={eventData.category}
          onChange={handleChange}
          required
        >
          <option value="Sports">Sports</option>
          <option value="Tech">Tech</option>
          <option value="Cultural">Cultural</option>
        </select>

        <button type="submit" className="btn btn-primary">
          Update Event
        </button>
      </form>
    </div>
    </div>
  );
};

export default EditEvent;
