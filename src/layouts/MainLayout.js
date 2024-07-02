// src/layouts/MainLayout.js
import React from 'react';
import PropTypes from 'prop-types';
import Footer from '../components/Footer';
import SideBar from '../components/SideBar';
import NavBar from '../components/NavBar';

const MainLayout = ({ children }) => {
  return (
    <div className="flex flex-col h-screen">
      <NavBar />
      <div className="flex flex-grow overflow-hidden">
        <SideBar />
        <div className="flex flex-col flex-grow overflow-auto">
          <main className="flex-grow p-6 bg-gray-100">{children}</main>
          <Footer />
        </div>
      </div>
    </div>
  );
};

MainLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default MainLayout;
