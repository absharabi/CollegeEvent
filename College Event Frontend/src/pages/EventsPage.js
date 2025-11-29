import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../services/api";
import "../styles/Dashboard.css"; // Reuse dashboard styles for consistency

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { categoryName } = useParams(); // Get category from URL

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        // If a category is present in the URL, fetch filtered events, otherwise fetch all
        const url = categoryName ? `/events/category/${categoryName}` : "/events";
        const res = await api.get(url);
        const allEvents = res.data;

        // Categorize events
        const now = new Date();
        now.setHours(0, 0, 0, 0);

        const upcoming = allEvents.filter(
          (event) => new Date(event.date) >= now
        );
        const past = allEvents.filter(
          (event) => new Date(event.date) < now
        );
        setUpcomingEvents(upcoming.sort((a, b) => new Date(a.date) - new Date(b.date))); // Sort ascending
        setPastEvents(past); // Already sorted descending from backend
      } catch (err) {
        setError("Failed to load events. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [categoryName]);

  if (loading) return <p className="loading-text">Loading events...</p>;

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>{categoryName ? `${categoryName} Events` : "Browse All Events"}</h1>
        <p>{categoryName ? `All available events under the ${categoryName} category.` : "Find the next exciting event to join!"}</p>
      </header>

      {error && <p className="error-msg">{error}</p>}

      {upcomingEvents.length > 0 && (
        <section className="dashboard-section">
          <h2>Upcoming Events</h2>
          <div className="registrations-grid">
            {upcomingEvents.map((event) => (
              <div key={event.id} className="event-card">
                <span className={`event-category ${event.category?.toLowerCase()}`}>{event.category}</span>
                <h3>{event.title}</h3>
                <p className="event-date">
                  {new Date(event.date).toLocaleDateString()}
                </p>
                <div className="event-actions">
                  <Link to={`/events/${event.id}`} className="btn btn-view">
                    View Details & Register
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {pastEvents.length > 0 && (
        <section className="dashboard-section">
          <h2>Past Events</h2>
          <div className="registrations-grid">
            {pastEvents.map((event) => (
              <div key={event.id} className="event-card past-event">
                <span className={`event-category ${event.category?.toLowerCase()}`}>{event.category}</span>
                <h3>{event.title}</h3>
                <p className="event-date">
                  {new Date(event.date).toLocaleDateString()}
                </p>
                <div className="event-actions">
                  <Link to={`/events/${event.id}`} className="btn btn-view">
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {upcomingEvents.length === 0 && pastEvents.length === 0 && (
        <div className="no-events">
          <p>No events are available at the moment. Please check back later!</p>
        </div>
      )}
    </div>
  );
};

export default EventsPage;