// src/layouts/MainLayout.js
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Footer from '../components/Footer';
import SideBar from '../components/SideBar';
import NavBar from '../components/NavBar';

const MainLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className={`main-layout ${isSidebarOpen ? 'sidebar-open' : ''}`}>
      <NavBar />
      <SideBar isOpen={isSidebarOpen} onToggle={handleSidebarToggle} />
      <div className={`main-content ${isSidebarOpen ? 'sidebar-open' : ''}`}>
        <main className="content">{children}</main>
        <Footer />
      </div>
    </div>
  );
};

MainLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default MainLayout;
