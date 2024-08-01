import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from '../services/authService';
import '../styles/NavBar.css'; // Import CSS
import { FaSignOutAlt } from 'react-icons/fa'; // Import icon
import { IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu'; // Import the Menu icon
import logo from '../assets/logo.png';
import SideBar from './SideBar'; // Import the Sidebar component

const NavBar = () => {
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false); // State to control drawer open/close

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return;
    }
    setDrawerOpen(open);
  };

  return (
    <nav className="navbar">
      {/* Button to open the sidebar, now positioned to the left of the logo */}
      <IconButton
        edge="start"
        color="inherit"
        aria-label="menu"
        onClick={toggleDrawer(true)}
      >
        <MenuIcon />
      </IconButton>

      <div className="navbar__logo">
        <img src={logo} alt="Logo" />
      </div>

      {/* Sidebar Component */}
      <SideBar
        open={drawerOpen}
        toggleDrawer={toggleDrawer}
        handleLogout={handleLogout}
      />

      {/* Logoff Button */}
      <button className="logout-button" onClick={handleLogout}>
        <FaSignOutAlt />
        Logoff
      </button>
    </nav>
  );
};

export default NavBar;
