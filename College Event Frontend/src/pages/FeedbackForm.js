import React, { useState, useContext, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";
import "../styles/Admin.css"; // Reusing form styles

const FeedbackForm = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [eventTitle, setEventTitle] = useState("");
  const [rating, setRating] = useState(0);
  const [comments, setComments] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch event title for display
    const fetchEventTitle = async () => {
      try {
        const response = await api.get(`/events/${eventId}`);
        setEventTitle(response.data.title);
      } catch (err) {
        console.error("Error fetching event title:", err);
        setEventTitle("Unknown Event");
      }
    };
    fetchEventTitle();
  }, [eventId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (!user || user.role !== "student") {
      setError("You must be logged in as a student to submit feedback.");
      setLoading(false);
      return;
    }
    if (rating === 0) {
      setError("Please provide a rating.");
      setLoading(false);
      return;
    }

    try {
      await api.post("/feedback", { eventId, rating, comments });
      setSuccess("Feedback submitted successfully! Redirecting to dashboard...");
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to submit feedback.");
      console.error("Feedback submission error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-container"> {/* Reusing admin-container for general page styling */}
      <Link to="/dashboard" className="back-link">&larr; Back to Dashboard</Link>
      <div className="form-container">
        <h2>Submit Feedback for {eventTitle}</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="rating">Rating:</label>
          <select id="rating" value={rating} onChange={(e) => setRating(Number(e.target.value))} required>
            <option value="0">Select a rating</option>
            <option value="1">1 - Poor</option>
            <option value="2">2 - Fair</option>
            <option value="3">3 - Good</option>
            <option value="4">4 - Very Good</option>
            <option value="5">5 - Excellent</option>
          </select>
          <label htmlFor="comments">Comments (Optional):</label>
          <textarea id="comments" value={comments} onChange={(e) => setComments(e.target.value)} placeholder="Any thoughts or suggestions?" rows="5"></textarea>
          {error && <p className="error-msg">{error}</p>}
          {success && <p className="success-msg">{success}</p>}
          <button type="submit" disabled={loading}>
            {loading ? "Submitting..." : "Submit Feedback"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default FeedbackForm;