import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { parkingAPI } from '../services/api';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    total: 5,
    available: 0,
    occupied: 0
  });
  const [loading, setLoading] = useState(true);

  const quotes = [
    "Smart parking for a smarter city!",
    "Park smart, live smart!",
    "Efficient parking, efficient life!",
    "Your parking solution is just a click away!",
    "Making parking hassle-free since today!"
  ];

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await parkingAPI.getSlots();
      const slots = response.data;
      const available = slots.filter(slot => slot.status === 'available').length;
      const occupied = slots.filter(slot => slot.status === 'occupied').length;
      
      setStats({
        total: slots.length,
        available,
        occupied
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Welcome back, {user?.name || user?.email}!</h1>
        <p className="quote">"{randomQuote}"</p>
      </div>

      <div className="stats-container">
        <div className="stat-card">
          <h3>Total Slots</h3>
          <div className="stat-number">{stats.total}</div>
        </div>
        <div className="stat-card available">
          <h3>Available</h3>
          <div className="stat-number">{stats.available}</div>
        </div>
        <div className="stat-card occupied">
          <h3>Occupied</h3>
          <div className="stat-number">{stats.occupied}</div>
        </div>
      </div>

      <div className="quick-links">
        <h2>Quick Actions</h2>
        <div className="links-container">
          <Link to="/slots" className="quick-link">
            <h3>View Parking Slots</h3>
            <p>Check slot availability and status</p>
          </Link>
          <Link to="/book" className="quick-link">
            <h3>Book Parking Slot</h3>
            <p>Reserve a parking slot</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;