import React, { useState, useEffect, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../services/api";
import { AuthContext } from "../../context/AuthContext";

const EventRegistrations = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchRegistrations = async () => {
      if (user?.role !== "admin" && user?.role !== "organizer") {
        setError("You are not authorized to view this page.");
        setLoading(false);
        return;
      }

      try {
        const response = await api.get(`/events/${id}/registrations`);
        setEvent(response.data.event);
        setRegistrations(response.data.registrations);
      } catch (err) {
        setError("Failed to fetch registrations. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRegistrations();
  }, [id, user]);

  if (loading) return <p>Loading registrations...</p>;
  if (error) return <p className="error-msg">{error}</p>;

  return (
    <div className="admin-container">
      <Link to="/admin/dashboard" className="back-link">
        &larr; Back to Dashboard
      </Link>
      <h2>Registrations for {event?.title}</h2>
      {registrations.length === 0 ? (
        <p>No users have registered for this event yet.</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>User Name</th>
              <th>Email</th>
              <th>Registration Date</th>
            </tr>
          </thead>
          <tbody>
            {registrations.map(({ User: registeredUser, registration_date }) => (
              <tr key={registeredUser.id}>
                <td>{registeredUser.name}</td>
                <td>{registeredUser.email}</td>
                <td>{new Date(registration_date).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default EventRegistrations;