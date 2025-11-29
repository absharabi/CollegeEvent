import React, { useEffect, useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";
import FeedbackModal from "../components/FeedbackModal"; // ✅ Make sure this exists
import "../styles/Dashboard.css"; // ✅ Create this new file

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [registrations, setRegistrations] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);
  const [submittedFeedback, setSubmittedFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.role !== "student") {
      navigate("/admin/dashboard");
      return;
    }

    const fetchDashboardData = async () => {
      try {
        // Fetch registrations and feedback independently to prevent a feedback error
        // from blocking the display of registered events.
        const registrationsRes = await api.get("/registration/my");
        const allRegistrations = registrationsRes.data;

        try {
          const feedbackRes = await api.get("/feedback/my");
          setSubmittedFeedback(feedbackRes.data.map((fb) => fb.event_id));
        } catch (feedbackError) {
          console.warn("Could not fetch feedback history:", feedbackError);
        }

        // Categorize events into upcoming and past
        const now = new Date(); // Get current date and time
        now.setHours(0, 0, 0, 0); // Set time to the beginning of the day for accurate comparison
        const upcoming = allRegistrations.filter(
          (r) => new Date(r.Event.date) >= now
        );
        const past = allRegistrations.filter(
          (r) => new Date(r.Event.date) < now
        );
        setUpcomingEvents(upcoming);
        setPastEvents(past);
      } catch (err) {
        // Check if the error is because the user has no registrations (which might return a 404 or empty array)
        // For now, we'll show a more generic but less alarming error.
        if (err.response && err.response.status === 404) {
          // This case is handled by the empty array check, so we can ignore the error.
        } else {
          setError("Could not load your dashboard. Please try again later.");
        }
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchDashboardData();
  }, [user, navigate]);

  const openFeedbackModal = (event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const closeFeedbackModal = (submitted) => {
    setIsModalOpen(false);
    setSelectedEvent(null);
    if (submitted) {
      // Add the event ID to the submitted feedback list to instantly disable the button
      setSubmittedFeedback([...submittedFeedback, selectedEvent.id]);
    }
  };

  const handleMarkAttended = async (registrationId) => {
    try {
      await api.put(`/registration/mark-attended/${registrationId}`);
      // Update the UI instantly without a page reload
      const updatedPastEvents = pastEvents.map(r => 
        r.id === registrationId ? { ...r, attended: true } : r
      );
      setPastEvents(updatedPastEvents);
    } catch (err) {
      alert(err.response?.data?.error || "Failed to mark attendance.");
      console.error("Self-attendance marking error:", err);
    }
  };

  const handleDownloadCertificate = async (eventId, eventTitle) => {
    try {
      const response = await api.get(`/events/${eventId}/certificate`, {
        responseType: "blob", // Important for file downloads
      });

      // Create a URL for the blob and trigger the download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Certificate - ${eventTitle}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (err) {
      alert(err.response?.data?.error || "Could not download certificate.");
      console.error("Certificate download error:", err);
    }
  };

  if (loading) return <p className="loading-text">Loading your dashboard...</p>;

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>My Dashboard</h1>
        <p>Welcome back, {user?.name}! Here are your registered events.</p>
        <Link to="/events" className="btn btn-primary" style={{ marginTop: '20px' }}>
          Browse More Events
        </Link>
      </header>

      {error && <p className="error-msg">{error}</p>}

      {isModalOpen && (
        <FeedbackModal
          eventId={selectedEvent?.id}
          eventTitle={selectedEvent?.title}
          closeModal={closeFeedbackModal}
        />
      )}

      {upcomingEvents.length > 0 && (
        <section className="dashboard-section">
          <h2>Upcoming Events</h2>
          <div className="registrations-grid">
            {upcomingEvents.map((r) => (
              <div key={r.id} className="event-card">
                <span className={`event-category ${r.Event.category?.toLowerCase()}`}>{r.Event.category}</span>
                <h3>{r.Event.title}</h3>
                <p className="event-date">
                  {new Date(r.Event.date).toLocaleDateString("en-US", {
                    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                  })}
                </p>
                <div className="event-actions">
                  <Link to={`/events/${r.Event.id}`} className="btn btn-view">
                    View Details
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
            {pastEvents.map((r) => (
              <div key={r.id} className="event-card past-event">
                <span className={`event-category ${r.Event.category?.toLowerCase()}`}>{r.Event.category}</span>
                <h3>{r.Event.title}</h3>
                <p className="event-date">
                  {new Date(r.Event.date).toLocaleDateString()}
                </p>
                <div className="event-actions">
                  {r.attended ? (
                    <button onClick={() => handleDownloadCertificate(r.Event.id, r.Event.title)} className="btn btn-certificate">
                      Download Certificate
                    </button>
                  ) : (
                    <button onClick={() => handleMarkAttended(r.id)} className="btn btn-mark-attended">
                      I Attended! ✔️
                    </button>
                  )}
                  <button
                    className="btn btn-feedback"
                    onClick={() => openFeedbackModal(r.Event)}
                    disabled={submittedFeedback.includes(r.Event.id)}
                  >
                    {submittedFeedback.includes(r.Event.id)
                      ? "Feedback Submitted"
                      : "Leave Feedback"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {upcomingEvents.length === 0 && pastEvents.length === 0 && (
          <div className="no-events">
            <div className="no-events-icon">🗓️</div>
            <p>You haven’t registered for any events yet.</p>
            <Link to="/events" className="btn btn-primary">
              Browse Events
            </Link>
          </div>
      )}
    </div>
  );
};

export default Dashboard;
