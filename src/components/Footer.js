// src/components/Footer.js
import React from 'react';
import '../styles/Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section about">
          <h3>About Us</h3>
          <p>
            We are a company committed to providing the best services and
            products to our customers.
          </p>
        </div>
        <div className="footer-section links">
          <h3>Useful Links</h3>
          <ul>
            <li>
              <a href="/about">About</a>
            </li>
            <li>
              <a href="/contact">Contact</a>
            </li>
            <li>
              <a href="/privacy-policy">Privacy Policy</a>
            </li>
          </ul>
        </div>
        <div className="footer-section contact">
          <h3>Contact Us</h3>
          <p>Email: info@company.com</p>
          <p>Phone: (123) 456-7890</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>
          &copy; {new Date().getFullYear()} Company Name. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
