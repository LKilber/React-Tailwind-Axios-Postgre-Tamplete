// src/layouts/MainLayout.js
import React from 'react';
import PropTypes from 'prop-types';
import NavBar from '../components/NavBar';
import SideBar from '../components/SideBar'; // Import Sidebar component
import '../styles/MainLayout.css';

const MainLayout = ({ children }) => {
  return (
    <div className="main-layout">
      <NavBar />
      <SideBar />
      <main className="main-content">
        <div className="content">{children}</div>
      </main>
    </div>
  );
};

MainLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default MainLayout;
