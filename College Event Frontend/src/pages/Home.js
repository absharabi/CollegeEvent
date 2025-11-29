import React from "react";
import { Link } from "react-router-dom";
import "../styles/global.css";


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
        <Link to="/events/category/Tech" className="card-link">
          <div className="card">
            <h2>Technical Fest</h2>
            <p>Join exciting hackathons, workshops, and coding contests.</p>
          </div>
        </Link>

        <Link to="/events/category/Cultural" className="card-link">
          <div className="card">
            <h2>Cultural Fest</h2>
            <p>Experience music, dance, art, and theatre performances.</p>
          </div>
        </Link>

        <Link to="/events/category/Sports" className="card-link">
          <div className="card">
            <h2>Sports Day</h2>
            <p>Compete, win, and cheer for your favorite college teams.</p>
          </div>
        </Link>
      </section>

      {/* Footer */}
      <footer>
        <p>© 2025 College Event Management | All Rights Reserved</p>
      </footer>
    </>
  );
};

export default Home;
