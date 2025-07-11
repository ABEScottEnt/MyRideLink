import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import {
  FaUser,
  FaSignOutAlt,
  FaCar,
  FaMapMarkerAlt,
  FaCreditCard,
  FaHistory,
  FaCog,
} from "react-icons/fa";

const Dashboard = () => (
  <div className="app-main-container">
    <h1 className="main-heading">Dashboard</h1>
    <p>Welcome to your dashboard! (Coming soon...)</p>
  </div>
);

export default Dashboard;
