import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <>
      {/* Hero Section */}
      <section className="hero">
        <h1>🎓 Welcome to College Event Management</h1>
        <p>
          Discover and participate in amazing college events — all in one place.
        </p>

        <Link to="/dashboard">
          <button>Explore Events</button>
        </Link>
      </section>

      {/* Event Categories */}
      <section className="cards">
        <div className="card">
          <h2>Technical Fest</h2>
          <p>Join exciting hackathons, workshops, and coding contests.</p>
        </div>

        <div className="card">
          <h2>Cultural Fest</h2>
          <p>Experience music, dance, art, and theatre performances.</p>
        </div>

        <div className="card">
          <h2>Sports Day</h2>
          <p>Compete, win, and cheer for your favorite college teams.</p>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <p>© 2025 College Event Management | All Rights Reserved</p>
      </footer>
    </>
  );
};

export default Home;
