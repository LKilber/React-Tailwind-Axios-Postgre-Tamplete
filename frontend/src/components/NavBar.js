import React from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from '../services/authService';
import '../styles/NavBar.css'; // Import CSS
import { FaSignOutAlt } from 'react-icons/fa'; // Import icon
import logo from '../assets/logo.png';

const NavBar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar__logo">
        <img src={logo} alt="Logo" />
      </div>

      {/* Logoff Button */}
      <button className="logout-button" onClick={handleLogout}>
        <FaSignOutAlt />
        Logoff
      </button>
    </nav>
  );
};

export default NavBar;
