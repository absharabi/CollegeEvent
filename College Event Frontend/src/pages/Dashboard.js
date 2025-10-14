import React from "react";

const Dashboard = () => {
  return (
    <div className="form-container">
      <h2>Dashboard</h2>
      <p>Manage your events and view analytics.</p>

      <div className="cards">
        <div className="card">
          <h2>Upcoming Events</h2>
          <p>See all upcoming college events.</p>
        </div>
        <div className="card">
          <h2>My Registrations</h2>
          <p>Check events you have registered for.</p>
        </div>
        <div className="card">
          <h2>Analytics</h2>
          <p>View event attendance and statistics.</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
