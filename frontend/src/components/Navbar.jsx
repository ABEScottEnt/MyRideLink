import "./Navbar.css";

const Navbar = () => (
  <header className="navbar-header">
    <img src="/logo.png" alt="My Ride Link Logo" className="navbar-logo" />
    <span className="navbar-title">MY RIDE LINK™</span>
    <nav className="navbar-nav">
      <a href="#" className="navbar-nav-link">
        Rides
      </a>
      <a href="#" className="navbar-nav-link">
        Rentals
      </a>
      <a href="#" className="navbar-nav-link">
        Public Transport
      </a>
      <a href="#" className="navbar-nav-link">
        Food
      </a>
      <a href="#" className="navbar-nav-link">
        Parcle
      </a>
    </nav>
    <div className="navbar-auth-buttons">
      <button className="navbar-btn">Log in</button>
      <button className="navbar-btn">Sign up</button>
    </div>
  </header>
);

export default Navbar;
