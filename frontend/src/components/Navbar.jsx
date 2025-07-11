import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => (
  <header className="navbar-header">
    <Link
      to="/"
      style={{ display: "flex", alignItems: "center", textDecoration: "none" }}
    >
      <img src="/logo.png" alt="My Ride Link Logo" className="navbar-logo" />
      <span className="app-title">MY RIDE LINK™</span>
    </Link>
    <nav className="navbar-nav">
      <Link to="/rides" className="navbar-nav-link">
        Rides
      </Link>
      <Link to="/rentals" className="navbar-nav-link">
        Rentals
      </Link>
      <Link to="/public-transport" className="navbar-nav-link">
        Public Transport
      </Link>
      <Link to="/food" className="navbar-nav-link">
        Food
      </Link>
      <Link to="/parcel" className="navbar-nav-link">
        Parcle
      </Link>
    </nav>
    <div className="navbar-auth-buttons">
      <Link to="/login" className="pill-btn">
        Log in
      </Link>
      <Link to="/login" className="pill-btn primary">
        Sign up
      </Link>
    </div>
  </header>
);

export default Navbar;
