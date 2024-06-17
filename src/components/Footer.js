// src/components/Footer.js
import React from 'react';
import '../styles/Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-bottom">
        <p>
          &copy; {new Date().getFullYear()} Preço&Risco. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;