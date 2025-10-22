import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import "../styles/Events.css"; // We'll create this CSS file next

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  if (loading) return <p className="loading-text">Loading events...</p>;
  if (error) return <p className="error-msg">{error}</p>;

  return (
    <div className="events-container">
      <div className="hero">
        <h1>Upcoming Events</h1>
        <p>Discover tech talks, cultural festivals, sports competitions, and more.</p>
      </div>
      <div className="cards">
        {events.length > 0 ? (
          events.map((event) => (
            <div key={event.id} className="card">
              <h2>{event.title}</h2>
              <p className="event-meta">{new Date(event.date).toLocaleDateString()} &bull; {event.location}</p>
              <p>{event.description.substring(0, 100)}...</p>
              <Link to={`/events/${event.id}`} className="btn-details">View Details</Link>
            </div>
          ))
        ) : (
          <p>No upcoming events at the moment. Please check back later!</p>
        )}
      </div>
    </div>
  );
};

export default Events;