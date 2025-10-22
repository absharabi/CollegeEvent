import React, { useState } from "react";
import "../styles/Feedback.css";

const StarRating = ({ rating, setRating }) => {
  const [hover, setHover] = useState(0);

  return (
    <div className="star-rating">
      {[...Array(10)].map((_, index) => {
        const ratingValue = (index + 1) / 2;
        const starClass =
          ratingValue <= (hover || rating)
            ? "on"
            : "off";
        return (
          <button
            type="button"
            key={ratingValue}
            className={`star-button ${starClass} ${index % 2 === 0 ? 'star-left' : 'star-right'}`}
            onClick={() => setRating(ratingValue)}
            onMouseEnter={() => setHover(ratingValue)}
            onMouseLeave={() => setHover(0)}
          >
            <span className="star">&#9733;</span> {/* Unicode star character */}
          </button>
        );
      })}
    </div>
  );
};

export default StarRating;