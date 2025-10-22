import React, { useEffect, useState, useContext } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AdminDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [events, setEvents] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editEvent, setEditEvent] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    category: "",
  });
  const navigate = useNavigate();

  // Fetch events
  const fetchEvents = async () => {
    try {
      const res = await api.get("/events");
      setEvents(res.data);
    } catch (err) {
      console.error("Error fetching events:", err);
    }
  };

  // Fetch all feedback for all events (admin action)
  const fetchFeedbacks = async () => {
    try {
      // This assumes you have an admin route to get all feedback.
      // Let's get feedback for each event individually for now.
      const feedbackPromises = events.map(event => api.get(`/feedback/event/${event.id}`));
      const feedbackResults = await Promise.all(feedbackPromises);
      // Flatten the array of arrays into a single feedback array
      setFeedbacks(feedbackResults.flatMap(res => res.data));
    } catch (err) {
      console.error("Error fetching feedbacks:", err);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await fetchEvents();
      await fetchFeedbacks();
      setLoading(false);
    };
    loadData();
  }, []); // Initial load

  useEffect(() => {
    if (events.length > 0) fetchFeedbacks();
  }, [events]); // Re-fetch feedback when events change

  // Delete Event
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;
    try {
      await api.delete(`/events/${id}`);
      alert("Event deleted successfully!");
      fetchEvents();
    } catch (err) {
      console.error("Error deleting event:", err);
      alert("Failed to delete event.");
    }
  };

  // Edit Event
  const handleEditClick = (event) => {
    setEditEvent(event.id);
    setFormData({
      title: event.title,
      description: event.description,
      date: event.date.split("T")[0],
      location: event.location,
      category: event.category,
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/events/${editEvent}`, formData);
      alert("✅ Event updated successfully!");
      setEditEvent(null);
      fetchEvents();
    } catch (err) {
      console.error("Error updating event:", err);
      alert("Failed to update event.");
    }
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Feedback chart
  const chartData = {
    labels: events.map((e) => e.title),
    datasets: [
      {
        label: "Average Rating",
        data: events.map((event) => { // Bug Fix: was f.event_id, should be f.eventId
          const eventFeedbacks = feedbacks.filter((f) => f.eventId === event.id);
          if (!eventFeedbacks.length) return 0;
          const avg =
            eventFeedbacks.reduce((sum, f) => sum + (f.rating || 0), 0) /
            eventFeedbacks.length;
          return avg.toFixed(2);
        }),
        backgroundColor: "rgba(54,162,235,0.7)",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: { legend: { position: "top" }, title: { display: true, text: "Event Feedback Ratings" } },
    scales: { y: { beginAtZero: true, max: 5 } },
  };

  if (loading) return <p>Loading Admin Dashboard...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1>Admin Dashboard</h1>
          <h2>Welcome, {user?.name || "Admin"}</h2>
        </div>
        <button
          onClick={handleLogout}
          style={{ background: "#dc3545", color: "white", padding: "10px 15px", border: "none", borderRadius: "5px", cursor: "pointer" }}
        >
          Logout
        </button>
      </div>

      {/* Event Cards */}
      <div style={{ display: "grid", gap: "15px", marginTop: "20px" }}>
        {events.map((event) => (
          <div
            key={event.id}
            style={{
              border: "1px solid #ccc",
              borderRadius: "10px",
              padding: "15px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          >
            <h2>{event.title}</h2>
            <p>{event.description}</p>
            <p>
              📅 {new Date(event.date).toLocaleDateString()} | 📍 {event.location}
            </p>

            <div style={{ marginTop: "10px" }}>
              <button
                style={{
                  background: "#007bff",
                  color: "white",
                  border: "none",
                  padding: "8px 12px",
                  borderRadius: "5px",
                  marginRight: "10px",
                }}
                onClick={() => handleEditClick(event)}
              >
                ✏️ Edit
              </button>
              <button
                style={{
                  background: "#ff4d4d",
                  color: "white",
                  border: "none",
                  padding: "8px 12px",
                  borderRadius: "5px",
                }}
                onClick={() => handleDelete(event.id)}
              >
                🗑️ Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {editEvent && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <form
            onSubmit={handleEditSubmit}
            style={{
              background: "white",
              padding: "30px",
              borderRadius: "10px",
              width: "400px",
            }}
          >
            <h2>Edit Event</h2>
            <input name="title" value={formData.title} onChange={handleChange} placeholder="Title" required />
            <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description" />
            <input name="location" value={formData.location} onChange={handleChange} placeholder="Location" required />
            <input type="date" name="date" value={formData.date} onChange={handleChange} required />
            <input name="category" value={formData.category} onChange={handleChange} placeholder="Category" required />
            <button type="submit">Save</button>
            <button type="button" onClick={() => setEditEvent(null)}>Cancel</button>
          </form>
        </div>
      )}

      {/* Feedback Chart */}
      <div style={{ marginTop: "40px" }}>
        <Bar data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default AdminDashboard;
