import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./pages/home.jsx";
import Auth from "./pages/Auth.jsx";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";

// Placeholder components for routes not yet implemented
const Rides = () => (
  <div className="app-main-container">
    <h1 className="main-heading">Car Rides</h1>
    <p>Coming soon...</p>
  </div>
);
const Rentals = () => (
  <div className="app-main-container">
    <h1 className="main-heading">Car Rentals</h1>
    <p>Coming soon...</p>
  </div>
);
const PublicTransport = () => (
  <div className="app-main-container">
    <h1 className="main-heading">Public Transport</h1>
    <p>Coming soon...</p>
  </div>
);
const Food = () => (
  <div className="app-main-container">
    <h1 className="main-heading">Food Delivery</h1>
    <p>Coming soon...</p>
  </div>
);
const Parcel = () => (
  <div className="app-main-container">
    <h1 className="main-heading">Parcel Delivery</h1>
    <p>Coming soon...</p>
  </div>
);

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/rides" element={<Rides />} />
        <Route path="/rentals" element={<Rentals />} />
        <Route path="/public-transport" element={<PublicTransport />} />
        <Route path="/food" element={<Food />} />
        <Route path="/parcel" element={<Parcel />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
