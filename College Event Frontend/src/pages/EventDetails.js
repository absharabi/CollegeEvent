import React from "react";
import { useParams } from "react-router-dom";

const EventDetails = () => {
  const { id } = useParams();

  return (
    <div className="form-container">
      <h2>Event Details</h2>
      <p>Details for event ID: {id}</p>

      <div className="cards">
        <div className="card">
          <h2>Event Name</h2>
          <p>Description of the event goes here.</p>
        </div>
        <div className="card">
          <h2>Date & Time</h2>
          <p>Event schedule and timings.</p>
        </div>
        <div className="card">
          <h2>Location</h2>
          <p>Venue of the event.</p>
        </div>
        <div className="card">
          <h2>Organizer</h2>
          <p>Contact information for the organizer.</p>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
