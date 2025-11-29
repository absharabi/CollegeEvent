import React, { useState, useEffect, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";
import "../styles/Admin.css";

const EventRegistrations = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useContext(AuthContext);

  const fetchRegistrations = async () => {
    try {
      // This backend route needs to be created
      const response = await api.get(`/events/${id}/registrations`);
      setEvent(response.data.event);
      // Sort by name for easier lookup
      setRegistrations(response.data.registrations.sort((a, b) => a.User.name.localeCompare(b.User.name)));
    } catch (err) {
      setError("Failed to fetch registrations. Please try again later.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Fetch the data when the component mounts
    if (user) {
      fetchRegistrations();
    }
  }, [id, user]);

  const handleAttendanceToggle = async (registrationId) => {
    try {
      await api.put(`/registration/${registrationId}/attendance`);
      // Update the state locally to reflect the change immediately
      setRegistrations(
        registrations.map((reg) =>
          reg.id === registrationId ? { ...reg, attended: !reg.attended } : reg
        )
      );
    } catch (err) {
      alert("Failed to update attendance.");
      console.error(err);
    }
  };

  if (loading) return <p>Loading registrations...</p>;
  if (error) return <p className="error-msg">{error}</p>;

  return (
    <div className="admin-container">
      <Link to="/admin/dashboard" className="back-link">
        &larr; Back to Dashboard
      </Link>
      <h2>Registrations for '{event?.title}'</h2>
      {registrations.length === 0 ? (
        <p>No users have registered for this event yet.</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>User Name</th>
              <th>Email</th>
              <th>Registration Date</th>
              <th>Attendance</th>
            </tr>
          </thead>
          <tbody>
            {registrations.map((reg) =>
              <tr key={reg.User.id}>
                <td>{reg.User.name}</td>
                <td>{reg.User.email}</td>
                <td>{new Date(reg.createdAt).toLocaleString()}</td>
                <td>
                  <button
                    onClick={() => handleAttendanceToggle(reg.id)}
                    className={`btn-attendance ${reg.attended ? "attended" : ""}`}
                  >
                    {reg.attended ? "Attended ✅" : "Mark Attended"}
                  </button>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default EventRegistrations;