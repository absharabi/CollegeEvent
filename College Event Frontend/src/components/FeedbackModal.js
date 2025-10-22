import React, { useState } from "react";
import api from "../services/api";
import StarRating from "./StarRating";
import "../styles/Feedback.css";

const FeedbackModal = ({ eventId, eventTitle, closeModal }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (rating === 0) {
      setError("Please provide a rating.");
      return;
    }

    try {
      await api.post("/feedback", { eventId, rating, comment });
      setSuccess("Thank you for your feedback!");
      setTimeout(() => {
        closeModal(true); // Pass true to indicate success and trigger a refresh
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to submit feedback.");
    }
  };

  return (
    <div className="modal">
      <div className="modal-content feedback-form">
        <button className="close-button" onClick={() => closeModal(false)}>&times;</button>
        <h2>Feedback for {eventTitle}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Your Rating</label>
            <StarRating rating={rating} setRating={setRating} />
          </div>
          <div className="form-group">
            <label htmlFor="comment">Your Comments (Optional)</label>
            <textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="What did you like or dislike?"
            />
          </div>
          {error && <p className="error-msg">{error}</p>}
          {success && <p className="success-msg">{success}</p>}
          <button type="submit" className="btn-primary">Submit Feedback</button>
        </form>
      </div>
    </div>
  );
};

export default FeedbackModal;