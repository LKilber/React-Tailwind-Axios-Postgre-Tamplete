// src/layouts/MainLayout.js
import React from 'react';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';

const MainLayout = ({ children }) => {
  return (
    <div>
      <NavBar />
      <main>{children}</main>
      <Footer />
    </div>
  );
};

export default MainLayout;
