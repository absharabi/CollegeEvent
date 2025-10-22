import React, { useState } from "react";
import api from "../services/api";
import { useParams, useNavigate } from "react-router-dom";

const FeedbackForm = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ rating: 3, comments: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // The backend route is /api/feedback/submit
      await api.post("/feedback/submit", {
        ...formData,
        eventId: eventId, // Use correct camelCase field name
      });
      alert("✅ Feedback submitted successfully!");
      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.error || "Error submitting feedback");
    }
  };

  return (
    <div className="feedback-form" style={{ maxWidth: "500px", margin: "40px auto" }}>
      <h2>Give Feedback</h2>
      <form onSubmit={handleSubmit}>
        <label>Rating (1–5)</label>
        <input
          type="number"
          name="rating"
          min="1"
          max="5"
          required
          value={formData.rating} // Default to a reasonable value
          onChange={handleChange}
        />

        <label>Comment</label>
        <textarea
          name="comments" // Use correct field name 'comments'
          value={formData.comments}
          onChange={handleChange}
          placeholder="Share your experience..."
        />

        <button
          type="submit"
          style={{
            background: "#007bff",
            color: "white",
            padding: "10px 15px",
            border: "none",
            borderRadius: "5px",
            marginTop: "10px",
          }}
        >
          Submit Feedback
        </button>
      </form>
    </div>
  );
};

export default FeedbackForm;
