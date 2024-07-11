// src/components/NavBar.js
import React from 'react';
import { FaQuestionCircle, FaUserCircle } from 'react-icons/fa';

const NavBar = () => {
  return (
    <nav className="navbar">
      <div className="flex items-center space-x-4">
        <FaQuestionCircle
          size={20}
          className="cursor-pointer hover:text-gray-400 transition duration-300"
        />
        <FaUserCircle
          size={20}
          className="cursor-pointer hover:text-gray-400 transition duration-300"
        />
      </div>
    </nav>
  );
};

export default NavBar;
