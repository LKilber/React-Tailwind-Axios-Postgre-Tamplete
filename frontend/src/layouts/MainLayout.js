// src/layouts/MainLayout.js
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import NavBar from '../components/NavBar';
import SideBar from '../components/SideBar'; // Import Sidebar component
import '../styles/MainLayout.css';

const MainLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleDrawer = (open) => () => {
    setIsSidebarOpen(open);
  };

  return (
    <div className="main-layout">
      <NavBar toggleDrawer={toggleDrawer} />
      <SideBar
        open={isSidebarOpen}
        toggleDrawer={toggleDrawer}
        handleLogout={() => {}}
      />
      <main
        className={`main-content ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}
      >
        <div className="content">{children}</div>
      </main>
    </div>
  );
};

MainLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default MainLayout;
