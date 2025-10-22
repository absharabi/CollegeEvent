import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/">🎓 College Events</Link>
      </div>

      {/* Hamburger Icon */}
      <div className="menu-icon" onClick={toggleMenu}>
        ☰
      </div>

      <ul className={`nav-links ${menuOpen ? "active" : ""}`}>
        <li><Link to="/">Home</Link></li>

        {user && (
          <>
            {user.role === "admin" && (
              <>
                <li><Link to="/admin/dashboard">Admin Dashboard</Link></li>
                <li><Link to="/admin/manage-events">Manage Events</Link></li>
              </>
            )}

            {user.role === "organizer" && (
              <>
                <li><Link to="/organizer/dashboard">Organizer Dashboard</Link></li>
                <li><Link to="/organizer/create-event">Create Event</Link></li>
              </>
            )}

            {user.role === "student" && (
              <>
                <li><Link to="/student/events">Events</Link></li>
                <li><Link to="/student/registrations">My Registrations</Link></li>
              </>
            )}
          </>
        )}

        {!user ? (
          <>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/register">Register</Link></li>
          </>
        ) : (
          <li>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
