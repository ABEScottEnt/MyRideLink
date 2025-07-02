import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { FaUser, FaSignOutAlt, FaCar, FaMapMarkerAlt, FaCreditCard, FaHistory, FaCog } from 'react-icons/fa';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FaCar },
    { id: 'rides', label: 'My Rides', icon: FaHistory },
    { id: 'payments', label: 'Payments', icon: FaCreditCard },
    { id: 'profile', label: 'Profile', icon: FaUser },
    { id: 'settings', label: 'Settings', icon: FaCog }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="dashboard-content">
            <div className="welcome-section">
              <h2>Welcome back, {user?.firstName || 'User'}! 👋</h2>
              <p>Ready for your next ride? Let's get you where you need to go.</p>
            </div>

            <div className="quick-actions">
              <h3>Quick Actions</h3>
              <div className="action-grid">
                <button className="action-card">
                  <FaCar className="action-icon" />
                  <span>Book a Ride</span>
                </button>
                <button className="action-card">
                  <FaMapMarkerAlt className="action-icon" />
                  <span>Set Destination</span>
                </button>
                <button className="action-card">
                  <FaCreditCard className="action-icon" />
                  <span>Add Payment</span>
                </button>
                <button className="action-card">
                  <FaHistory className="action-icon" />
                  <span>Ride History</span>
                </button>
              </div>
            </div>

            <div className="stats-section">
              <h3>Your Stats</h3>
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-number">12</div>
                  <div className="stat-label">Total Rides</div>
                </div>
                <div className="stat-card">
                  <div className="stat-number">$156</div>
                  <div className="stat-label">Total Spent</div>
                </div>
                <div className="stat-card">
                  <div className="stat-number">4.8</div>
                  <div className="stat-label">Rating</div>
                </div>
                <div className="stat-card">
                  <div className="stat-number">3</div>
                  <div className="stat-label">Saved Places</div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'rides':
        return (
          <div className="dashboard-content">
            <h2>My Rides</h2>
            <div className="rides-list">
              <div className="ride-item">
                <div className="ride-info">
                  <div className="ride-locations">
                    <div className="ride-origin">📍 Home</div>
                    <div className="ride-destination">🏢 Office</div>
                  </div>
                  <div className="ride-details">
                    <span className="ride-date">Today, 9:30 AM</span>
                    <span className="ride-price">$12.50</span>
                  </div>
                </div>
                <div className="ride-status completed">Completed</div>
              </div>

              <div className="ride-item">
                <div className="ride-info">
                  <div className="ride-locations">
                    <div className="ride-origin">🏢 Office</div>
                    <div className="ride-destination">🏠 Home</div>
                  </div>
                  <div className="ride-details">
                    <span className="ride-date">Yesterday, 6:15 PM</span>
                    <span className="ride-price">$14.20</span>
                  </div>
                </div>
                <div className="ride-status completed">Completed</div>
              </div>

              <div className="ride-item">
                <div className="ride-info">
                  <div className="ride-locations">
                    <div className="ride-origin">🏠 Home</div>
                    <div className="ride-destination">🛒 Mall</div>
                  </div>
                  <div className="ride-details">
                    <span className="ride-date">Dec 15, 2:00 PM</span>
                    <span className="ride-price">$8.75</span>
                  </div>
                </div>
                <div className="ride-status completed">Completed</div>
              </div>
            </div>
          </div>
        );

      case 'payments':
        return (
          <div className="dashboard-content">
            <h2>Payment Methods</h2>
            <div className="payment-methods">
              <div className="payment-method">
                <div className="payment-info">
                  <div className="card-icon">💳</div>
                  <div className="card-details">
                    <div className="card-number">•••• •••• •••• 4242</div>
                    <div className="card-name">Visa ending in 4242</div>
                  </div>
                </div>
                <div className="payment-actions">
                  <button className="btn-secondary">Edit</button>
                  <button className="btn-secondary">Remove</button>
                </div>
              </div>

              <button className="add-payment-btn">
                <FaCreditCard />
                <span>Add Payment Method</span>
              </button>
            </div>
          </div>
        );

      case 'profile':
        return (
          <div className="dashboard-content">
            <h2>Profile</h2>
            <div className="profile-section">
              <div className="profile-avatar">
                <div className="avatar-placeholder">
                  {user?.firstName?.charAt(0) || 'U'}
                </div>
              </div>
              
              <div className="profile-info">
                <div className="info-group">
                  <label>First Name</label>
                  <input 
                    type="text" 
                    value={user?.firstName || ''} 
                    className="profile-input"
                    readOnly
                  />
                </div>
                
                <div className="info-group">
                  <label>Last Name</label>
                  <input 
                    type="text" 
                    value={user?.lastName || ''} 
                    className="profile-input"
                    readOnly
                  />
                </div>
                
                <div className="info-group">
                  <label>Email</label>
                  <input 
                    type="email" 
                    value={user?.email || ''} 
                    className="profile-input"
                    readOnly
                  />
                </div>
                
                <div className="info-group">
                  <label>Phone</label>
                  <input 
                    type="tel" 
                    value={user?.phoneNumber || 'Not provided'} 
                    className="profile-input"
                    readOnly
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 'settings':
        return (
          <div className="dashboard-content">
            <h2>Settings</h2>
            <div className="settings-section">
              <div className="setting-group">
                <h3>Notifications</h3>
                <div className="setting-item">
                  <div className="setting-info">
                    <span>Push Notifications</span>
                    <span className="setting-description">Receive ride updates and promotions</span>
                  </div>
                  <label className="toggle">
                    <input type="checkbox" defaultChecked />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
                
                <div className="setting-item">
                  <div className="setting-info">
                    <span>Email Notifications</span>
                    <span className="setting-description">Receive receipts and updates via email</span>
                  </div>
                  <label className="toggle">
                    <input type="checkbox" defaultChecked />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>

              <div className="setting-group">
                <h3>Privacy</h3>
                <div className="setting-item">
                  <div className="setting-info">
                    <span>Location Services</span>
                    <span className="setting-description">Allow MyRideLink to access your location</span>
                  </div>
                  <label className="toggle">
                    <input type="checkbox" defaultChecked />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <h1>MyRideLink</h1>
          </div>
          <div className="header-right">
            <div className="user-menu">
              <div className="user-info">
                <span>Welcome, {user?.firstName || 'User'}</span>
              </div>
              <button onClick={handleLogout} className="logout-btn">
                <FaSignOutAlt />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="dashboard-main">
        {/* Sidebar */}
        <aside className="dashboard-sidebar">
          <nav className="sidebar-nav">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  className={`nav-item ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <Icon className="nav-icon" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Content Area */}
        <main className="dashboard-content-area">
          {renderTabContent()}
        </main>
      </div>
    </div>
  );
};

export default Dashboard; 