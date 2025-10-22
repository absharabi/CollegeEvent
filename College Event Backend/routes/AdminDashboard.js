import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import { AuthContext } from "../../context/AuthContext";
import "../../styles/Admin.css"; // This path will need to be correct relative to its new location

const AdminDashboard = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useContext(AuthContext);

  // Fetch events when the component mounts
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await api.get("/events");
        setEvents(response.data);
      } catch (err) {
        setError("Failed to fetch events. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Handle event deletion
  const handleDelete = async (eventId) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this event? This will also remove all associated registrations and feedback."
      )
    ) {
      return;
    }

    try {
      await api.delete(`/events/${eventId}`);
      // Remove the deleted event from the state to update the UI
      setEvents(events.filter((event) => event.id !== eventId));
    } catch (err) {
      setError(err.response?.data?.error || "Failed to delete event.");
      console.error(err);
    }
  };

  if (loading) return <p>Loading dashboard...</p>;

  return (
    <div className="admin-container">
      <h2>Admin Dashboard</h2>
      <p>Welcome, {user?.name}! Manage all college events from here.</p>

      <div className="admin-actions">
        <Link to="/admin/event/create" className="btn btn-primary">
          + Create New Event
        </Link>
      </div>

      {error && <p className="error-msg">{error}</p>}

      <h3>All Events</h3>
      {events.length === 0 ? (
        <p>No events found. Create one to get started!</p>
      ) : (
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
                  <Link to={`/admin/event/${event.id}/registrations`}>
                    Registrations
                  </Link>
                  <Link to={`/admin/event/edit/${event.id}`}>Edit</Link>
                  <button onClick={() => handleDelete(event.id)} className="btn-delete">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminDashboard;