import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api"; // Import the centralized API service

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
    <div className="max-w-lg mx-auto mt-8">
      <h2 className="text-2xl font-semibold mb-4">Edit Event</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          name="title"
          value={eventData.title}
          onChange={handleChange}
          placeholder="Title"
          className="border p-2 w-full"
        />
        <textarea
          name="description"
          value={eventData.description}
          onChange={handleChange}
          placeholder="Description"
          className="border p-2 w-full"
        />
        <input
          type="date"
          name="date"
          value={eventData.date}
          onChange={handleChange}
          className="border p-2 w-full"
        />
        <input
          name="location"
          value={eventData.location}
          onChange={handleChange}
          placeholder="Location"
          className="border p-2 w-full"
        />
        <select
          name="category"
          value={eventData.category}
          onChange={handleChange}
          className="border p-2 w-full"
        >
          <option value="Sports">Sports</option>
          <option value="Tech">Tech</option>
          <option value="Cultural">Cultural</option>
        </select>

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Update Event
        </button>
      </form>
    </div>
  );
};

export default EditEvent;
