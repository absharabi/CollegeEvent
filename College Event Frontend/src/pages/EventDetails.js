import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await api.get(`/events/${id}`);
        setEvent(response.data);
      } catch (err) {
        console.error("Error fetching event details:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  if (loading) return <p>Loading event details...</p>;
  if (!event) return <p>Event not found.</p>;

  const handleFeedbackClick = () => {
    navigate(`/feedback/${event.id}`);
  };

  return (
    <div
      style={{
        padding: "30px",
        maxWidth: "700px",
        margin: "0 auto",
        border: "1px solid #ddd",
        borderRadius: "10px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      }}
    >
      <h1>{event.title}</h1>
      <p style={{ fontSize: "1.1em", color: "#444" }}>{event.description}</p>

      <p>
        📍 <strong>Location:</strong> {event.location}
      </p>
      <p>
        📅 <strong>Date:</strong>{" "}
        {new Date(event.date).toLocaleDateString("en-GB")}
      </p>

      {/* Show feedback button only for students */}
      {user?.role === "student" && (
        <button
          onClick={handleFeedbackClick}
          style={{
            background: "#007bff",
            color: "white",
            border: "none",
            padding: "10px 15px",
            borderRadius: "5px",
            cursor: "pointer",
            marginTop: "20px",
          }}
        >
          💬 Give Feedback
        </button>
      )}

      {/* Admin view: maybe future options */}
      {user?.role === "admin" && (
        <p style={{ color: "#888", marginTop: "15px" }}>
          (Admin view: feedback not available)
        </p>
      )}
    </div>
  );
};

export default EventDetails;
