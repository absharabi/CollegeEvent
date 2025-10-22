import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const AddEvent = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [category, setCategory] = useState("Tech"); // Add category state
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/events", {
        title,
        description,
        location,
        date,
        category,
      });

      setMessage("✅ Event created successfully! Redirecting...");
      setTimeout(() => navigate("/admin/dashboard"), 1500);
      setTitle("");
      setDescription("");
      setLocation("");
      setDate("");
    } catch (error) {
      console.error("Error creating event:", error);
      setMessage(error.response?.data?.error || "⚠️ Something went wrong.");
    }
  };

  return (
    <div className="form-container" style={{ padding: "20px" }}>
      <h2>Add New Event</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Event Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="Tech">Tech</option>
          <option value="Cultural">Cultural</option>
          <option value="Sports">Sports</option>
        </select>
        <button type="submit">Add Event</button>
      </form>

      {message && <p style={{ marginTop: "10px" }}>{message}</p>}
    </div>
  );
};

export default AddEvent;
