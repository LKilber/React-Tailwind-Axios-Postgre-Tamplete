// src/components/NavBar.js
import React from 'react';
import { FaQuestionCircle, FaUserCircle } from 'react-icons/fa';
import logo from '../assets/theweslley.png'; // Caminho para a sua logo

import '../styles/NavBar.css'; // Importe o arquivo CSS personalizado

const NavBar = () => {
  return (
    <nav className="bg-white text-black flex justify-between items-center p-4 shadow-lg">
      <div className="flex items-center">
        <img src={logo} alt="Logo" className="h-12 logo" />
      </div>
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
