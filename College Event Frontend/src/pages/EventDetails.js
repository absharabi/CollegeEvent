import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";
import "../styles/Dashboard.css"; // Reusing some styles

const EventDetails = () => {
  const { id } = useParams(); // Get the event ID from the URL
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [registrationStatus, setRegistrationStatus] = useState("");
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const response = await api.get(`/events/${id}`);
        setEvent(response.data);
      } catch (err) {
        setError("Failed to load event details. It might not exist.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [id]);

  const handleRegister = async () => {
    if (!user) {
      setRegistrationStatus("Please log in to register.");
      return;
    }

    try {
      await api.post(`/registration/${id}`);
      setRegistrationStatus("✅ Successfully registered! Redirecting to your dashboard...");
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000); // Redirect after 2 seconds
    } catch (err) {
      setRegistrationStatus(
        err.response?.data?.error || "⚠️ Registration failed. You may already be registered."
      );
    }
  };

  return (
    <div className="dashboard-container">
      {loading ? (
        <p className="loading-text">Loading event details...</p>
      ) : error ? (
        <p className="error-msg">{error}</p>
      ) : event ? (
        <div className="event-card-full">
          <h1>{event.title}</h1>
          <p className="event-meta">
            <strong>Category:</strong> {event.category} | <strong>Location:</strong> {event.location}
          </p>
          <p className="event-meta">
            <strong>Date:</strong> {new Date(event.date).toLocaleDateString("en-US", {
              year: 'numeric', month: 'long', day: 'numeric'
            })}
          </p>
          <p className="event-description-full">{event.description}</p>

          {user?.role === "student" && (
            <div className="registration-section">
              <button onClick={handleRegister} className="btn btn-primary">Register for this Event</button>
              {registrationStatus && <p className="status-msg">{registrationStatus}</p>}
            </div>
          )}
        </div>
      ) : (
        <p>No event found.</p>
      )}
    </div>
  );
};

export default EventDetails;