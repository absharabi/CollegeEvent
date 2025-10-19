import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Dashboard = () => {
  const { user, token } = useContext(AuthContext);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch all events from backend
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/events/all", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to load events");
        setEvents(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, [token]);

  if (loading) return <p className="loading">Loading Dashboard...</p>;
  if (error) return <p className="error-msg">{error}</p>;

  return (
    <div className="dashboard-container">
      <h2>Welcome, {user?.name || "User"} 👋</h2>
      <p>Manage your events and view analytics below.</p>

      <div className="cards">
        <div className="card">
          <h3>📅 Upcoming Events</h3>
          {events.length > 0 ? (
            <ul>
              {events.map((event) => (
                <li key={event.id}>
                  <strong>{event.title}</strong> — {event.date}
                </li>
              ))}
            </ul>
          ) : (
            <p>No upcoming events yet.</p>
          )}
        </div>

        <div className="card">
          <h3>📝 My Registrations</h3>
          <p>Feature coming soon — list user’s registered events.</p>
        </div>

        <div className="card">
          <h3>📊 Analytics</h3>
          <p>Charts and feedback statistics will appear here.</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
