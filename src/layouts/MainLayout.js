// src/layouts/MainLayout.js
import React from 'react';
import PropTypes from 'prop-types';
import Footer from '../components/Footer';
import SideBar from '../components/SideBar';

const MainLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen">
      <SideBar />
      <div className="flex flex-col flex-grow">
        <main className="flex-grow p-6 bg-gray-100">{children}</main>
        <Footer />
      </div>
    </div>
  );
};

MainLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default MainLayout;
