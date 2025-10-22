import React, { useState, useEffect, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";
import "../styles/EventDetail.css"; // We'll create this CSS file next

const EventDetail = () => {
  const { id } = useParams(); // Get event ID from URL
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [registrationStatus, setRegistrationStatus] = useState(""); // To show if registered or not

  useEffect(() => {
    const fetchEventAndRegistrationStatus = async () => {
      try {
        // Fetch event details
        const eventResponse = await api.get(`/events/${id}`);
        setEvent(eventResponse.data);

        // If user is logged in, check registration status
        if (user) {
          const myRegistrationsResponse = await api.get("/registration/my");
          const isRegistered = myRegistrationsResponse.data.some(
            (reg) => reg.event_id === parseInt(id)
          );
          if (isRegistered) {
            setRegistrationStatus("You are already registered for this event.");
          }
        }
      } catch (err) {
        setError("Failed to fetch event details. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEventAndRegistrationStatus();
  }, [id, user]); // Re-run if event ID or user changes

  const handleRegister = async () => {
    if (!user) {
      navigate("/login"); // Redirect to login if not authenticated
      return;
    }

    try {
      await api.post("/registration/register", { eventId: id });
      setRegistrationStatus("Successfully registered for this event!");
    } catch (err) {
      setError(
        err.response?.data?.error ||
          "Failed to register for event. Please try again."
      );
      console.error(err);
    }
  };

  if (loading) return <p className="loading-text">Loading event details...</p>;
  if (error) return <p className="error-msg">{error}</p>;
  if (!event) return <p className="error-msg">Event not found.</p>;

  return (
    <div className="event-detail-container">
      <Link to="/events" className="back-link">&larr; Back to Events</Link>
      <div className="event-header">
        <h1>{event.title}</h1>
        <p className="event-meta">
          {new Date(event.date).toLocaleDateString()} &bull; {event.location} &bull; {event.category}
        </p>
        {event.creator && (
          <p className="event-creator">Organized by: {event.creator.name}</p>
        )}
      </div>

      <div className="event-description">
        <h3>Description</h3>
        <p>{event.description}</p>
      </div>

      <div className="event-actions">
        {user ? (
          registrationStatus ? (
            <p className="registration-status">{registrationStatus}</p>
          ) : (
            <button onClick={handleRegister} className="btn-register">Register for Event</button>
          )
        ) : (
          <p>Please <Link to="/login">log in</Link> to register for this event.</p>
        )}
        {error && <p className="error-msg">{error}</p>}
      </div>
    </div>
  );
};

export default EventDetail;