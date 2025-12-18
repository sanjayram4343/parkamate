import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          ParkMate
        </Link>
        <div className="nav-menu">
          <Link to="/" className="nav-link">Dashboard</Link>
          <Link to="/slots" className="nav-link">Slots</Link>
          <Link to="/records" className="nav-link">Records</Link>
          <button onClick={handleLogout} className="nav-link logout-btn">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;