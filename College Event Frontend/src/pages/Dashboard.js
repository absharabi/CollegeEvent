import React, { useEffect, useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [registrations, setRegistrations] = useState([]);
  const [submittedFeedback, setSubmittedFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect non-students away from this dashboard
    if (user && user.role !== "student") {
      navigate("/admin/dashboard");
      return;
    }

    const fetchDashboardData = async () => {
      try {
        // Fetch registrations and feedback in parallel
        const [registrationsResponse, feedbackResponse] = await Promise.all([
          api.get("/registration/my"),
          api.get("/feedback/my"),
        ]);
        setRegistrations(registrationsResponse.data);
        setSubmittedFeedback(feedbackResponse.data.map(fb => fb.eventId));
      } catch (err) {
        setError("Failed to load your registered events.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchDashboardData();
    }
  }, [user, navigate]); // This was missing a closing brace

  const openFeedbackModal = (event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const closeFeedbackModal = (submitted) => {
    setIsModalOpen(false);
    setSelectedEvent(null);
    if (submitted) {
      // Refresh data if feedback was submitted
      window.location.reload(); // Simple refresh for now
    }
  }; // This closing brace was for useEffect, not closeFeedbackModal

  if (loading) return <p className="loading-text">Loading your dashboard...</p>;

  return (
    <div className="dashboard-container">
      <h1>My Dashboard</h1>
      <p>Welcome, {user?.name}! Here are the events you've registered for.</p>

      {error && <p className="error-msg">{error}</p>}

      {isModalOpen && (
        <FeedbackModal
          eventId={selectedEvent.id}
          eventTitle={selectedEvent.title}
          closeModal={closeFeedbackModal}
        />
      )}

      <div className="registrations-list">
        {registrations.length > 0 ? (
          registrations.map((registration) => (
            <div key={registration.id} className="registration-card">
              <div className="registration-details">
                <h3>{registration.Event.title}</h3>
                <p>
                  {new Date(registration.Event.date).toLocaleDateString()}
                </p>
              </div>
              <div className="registration-actions">
                <Link
                  to={`/events/${registration.Event.id}`}
                  className="btn-view"
                >
                  View Event
                </Link>
                <button
                  className="btn-feedback"
                  onClick={() => openFeedbackModal(registration.Event)}
                  disabled={submittedFeedback.includes(registration.Event.id)}
                >
                  {submittedFeedback.includes(registration.Event.id)
                    ? "Feedback Submitted"
                    : "Leave Feedback"}
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="no-registrations">
            <p>You haven't registered for any events yet.</p>
            <Link to="/events" className="btn-primary">
              Browse Events
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
