import React, { useState, useEffect, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../services/api";
import { AuthContext } from "../../context/AuthContext";
import "./Admin.css"; // Assuming a shared CSS file for admin pages

const EventFeedback = () => {
  const { id } = useParams(); // Get event ID from URL
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchFeedback = async () => {
      if (user?.role !== "admin" && user?.role !== "organizer") {
        setError("You are not authorized to view this page.");
        setLoading(false);
        return;
      }

      try {
        const response = await api.get(`/events/${id}/feedback`);
        setFeedback(response.data);
      } catch (err) {
        setError("Failed to fetch feedback. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedback();
  }, [id, user]);

  if (loading) return <p>Loading feedback...</p>;
  if (error) return <p className="error-msg">{error}</p>;

  return (
    <div className="admin-container">
      <Link to="/admin/dashboard" className="back-link">
        &larr; Back to Dashboard
      </Link>
      <h2>Feedback for Event ID: {id}</h2>
      {feedback.length === 0 ? (
        <p>No feedback has been submitted for this event yet.</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>User Name</th>
              <th>Rating</th>
              <th>Comment</th>
              <th>Submitted At</th>
            </tr>
          </thead>
          <tbody>
            {feedback.map((fb) => (
              <tr key={fb.id}>
                <td>{fb.User.name}</td>
                <td>{fb.rating}</td>
                <td>{fb.comment}</td>
                <td>{new Date(fb.submitted_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default EventFeedback;