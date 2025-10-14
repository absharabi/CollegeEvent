import React from "react";
import { Link } from "react-router-dom";

const EventCard = ({ event }) => {
  return (
    <div className="card">
      <h2>{event.title}</h2>
      <p>{event.date}</p>
      <p>{event.location}</p>
      <Link to={`/events/${event.id}`}>
        <button>View Details</button>
      </Link>
    </div>
  );
};

export default EventCard;
