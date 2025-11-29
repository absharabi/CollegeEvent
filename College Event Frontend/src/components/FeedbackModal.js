import React, { useState, useContext } from "react";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";
import "../styles/global.css"; // Assuming modal styles are in global.css

const FeedbackModal = ({ eventId, eventTitle, closeModal }) => {
  const [rating, setRating] = useState(0);
  const [comments, setComments] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (!user) {
      setError("You must be logged in to submit feedback.");
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
      setSuccess("Feedback submitted successfully!");
      setTimeout(() => {
        closeModal(true); // Pass true to indicate feedback was submitted
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to submit feedback.");
      console.error("Feedback submission error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Leave Feedback for {eventTitle}</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="rating" style={{ display: 'block', marginBottom: '5px' }}>Rating:</label>
            <select
              id="rating"
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              required
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            >
              <option value="0">Select a rating</option>
              <option value="1">1 - Poor</option>
              <option value="2">2 - Fair</option>
              <option value="3">3 - Good</option>
              <option value="4">4 - Very Good</option>
              <option value="5">5 - Excellent</option>
            </select>
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="comments" style={{ display: 'block', marginBottom: '5px' }}>Comments (Optional):</label>
            <textarea
              id="comments"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Any thoughts or suggestions?"
              rows="4"
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            ></textarea>
          </div>
          {error && <p className="error-msg">{error}</p>}
          {success && <p className="success-msg">{success}</p>}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button type="button" onClick={() => closeModal(false)} className="btn btn-secondary">Cancel</button>
            <button type="submit" disabled={loading} className="btn btn-primary">
              {loading ? "Submitting..." : "Submit Feedback"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FeedbackModal;