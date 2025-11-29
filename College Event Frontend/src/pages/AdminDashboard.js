import React, { useEffect, useState, useContext } from "react";
import api from "../services/api"; // Correct path
import { useNavigate, Link } from "react-router-dom"; // Import Link
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
  const { user, logout } = useContext(AuthContext); // Keep logout here for the button
  const [events, setEvents] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalUsers: 0,
    totalRegistrations: 0,
    upcomingEventsCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [editEvent, setEditEvent] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    category: "",
  });
  const navigate = useNavigate(); // Keep navigate here

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [eventsRes, statsRes] = await Promise.all([
          api.get("/events"),
          api.get("/admin/stats"),
        ]);

        const fetchedEvents = eventsRes.data;
        setEvents(fetchedEvents);
        setStats(statsRes.data);

        if (fetchedEvents.length > 0) {
          const feedbackPromises = fetchedEvents.map((event) => api.get(`/feedback/event/${event.id}`));
          const feedbackResults = await Promise.all(feedbackPromises);
          setFeedbacks(feedbackResults.flatMap(res => res.data));
        }
      } catch (err) {
        console.error("Failed to load admin dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []); // Initial load

  // Delete Event
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;
    try {
      await api.delete(`/events/${id}`);
      alert("Event deleted successfully!");
      setEvents(events.filter(event => event.id !== id)); // Update state directly
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
      // Refetch events to show updated data
      const res = await api.get("/events");
      setEvents(res.data);
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
          const eventFeedbacks = feedbacks.filter((f) => f.event_id === event.id); // Corrected to event_id
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
    <div className="admin-container"> {/* Use admin-container class */}
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

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <h4>Total Events</h4>
          <p>{stats.totalEvents}</p>
        </div>
        <div className="stat-card">
          <h4>Upcoming Events</h4>
          <p>{stats.upcomingEventsCount}</p>
        </div>
        <div className="stat-card">
          <h4>Total Students</h4>
          <p>{stats.totalUsers}</p>
        </div>
        <div className="stat-card">
          <h4>Total Registrations</h4>
          <p>{stats.totalRegistrations}</p>
        </div>
      </div>

      <div className="admin-actions">
        <Link to="/admin/add-event" className="btn btn-primary"> {/* Corrected link */}
          + Create New Event
        </Link>
      </div>

      {/* Event Cards */}
      <div className="admin-table-wrapper"> {/* Use a wrapper for table styling */}
        <table className="admin-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Date</th>
              <th>Location</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
        {events.map((event) => (
          <tr key={event.id}>
            <td>{event.title}</td>
            <td>{new Date(event.date).toLocaleDateString()}</td>
            <td>{event.location}</td>
            <td className="action-links">
              <Link to={`/admin/events/${event.id}/registrations`}>Registrations</Link>
              <Link to={`/admin/edit-event/${event.id}`}>Edit</Link>
              <button onClick={() => handleDelete(event.id)} className="btn-delete">Delete</button>
            </td>
          </tr>
        ))}
          </tbody>
        </table>
      </div>

      {/* Feedback Chart */}
      <div style={{ marginTop: "40px" }}>
        <Bar data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default AdminDashboard;
