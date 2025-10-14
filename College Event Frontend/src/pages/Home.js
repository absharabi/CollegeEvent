import React from "react";

const Home = () => {
  return (
    <div className="hero">
      <h1>Welcome to College Event Management</h1>
      <p>Discover and participate in amazing college events — all in one place.</p>
      
      <button>Explore Events</button>

      <div className="cards">
        <div className="card">
          <h2>Technical Fest</h2>
          <p>Join exciting hackathons and coding contests.</p>
        </div>
        <div className="card">
          <h2>Cultural Fest</h2>
          <p>Experience music, dance, drama, and more!</p>
        </div>
        <div className="card">
          <h2>Sports Day</h2>
          <p>Compete and cheer for your favorite teams.</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
