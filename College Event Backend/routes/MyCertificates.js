import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";
import "../styles/Dashboard.css"; // Reuse dashboard styles for consistency

const MyCertificates = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchCertificates = async () => {
      if (!user) return;
      try {
        const response = await api.get("/registration/my-certificates");
        setCertificates(response.data);
      } catch (err) {
        setError("Could not load your certificates. Please try again later.");
        console.error("Certificate fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCertificates();
  }, [user]);

  const handleDownloadCertificate = async (eventId, eventTitle) => {
    try {
      const response = await api.get(`/events/${eventId}/certificate`, {
        responseType: "blob", // Important for file downloads
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Certificate - ${eventTitle}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (err) {
      alert(err.response?.data?.error || "Could not download certificate.");
    }
  };

  if (loading) return <p className="loading-text">Loading your certificates...</p>;

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>My Certificates 🏆</h1>
        <p>Here are the certificates you've earned for attending events.</p>
      </header>

      {error && <p className="error-msg">{error}</p>}

      <div className="registrations-grid">
        {certificates.length > 0 ? (
          certificates.map((cert) => (
            <div key={cert.id} className="event-card">
              <span className={`event-category ${cert.Event.category?.toLowerCase()}`}>{cert.Event.category}</span>
              <h3>{cert.Event.title}</h3>
              <p className="event-date">
                Attended on: {new Date(cert.Event.date).toLocaleDateString()}
              </p>
              <div className="certificate-action">
                <button onClick={() => handleDownloadCertificate(cert.Event.id, cert.Event.title)} className="btn btn-certificate">
                  Download Certificate
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="no-events">
            <p>You haven't earned any certificates yet. Attend an event to get started!</p>
            <Link to="/dashboard" className="btn btn-primary">Go to My Dashboard</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCertificates;