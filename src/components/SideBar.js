import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import {
  FaBars,
  FaHome,
  FaDollarSign,
  FaSignOutAlt,
  FaFileAlt,
  FaChevronLeft,
} from 'react-icons/fa';

const SideBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showText, setShowText] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => setShowText(true), 150);
      return () => clearTimeout(timer);
    } else {
      setShowText(false);
    }
  }, [isOpen]);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div
      className={`flex flex-col ${isOpen ? 'w-48' : 'w-12'} bg-blue-900 text-white min-h-screen transition-all duration-300 ease-in-out shadow-lg`}
    >
      <div className="flex flex-col items-center mt-4 space-y-2">
        <button
          onClick={toggleSidebar}
          className="text-white focus:outline-none w-full flex justify-center py-2 hover:bg-blue-700 transition-colors duration-300"
        >
          {isOpen ? <FaChevronLeft size={20} /> : <FaBars size={20} />}
        </button>
        <NavLink
          to="/home"
          className="w-full flex items-center py-2 px-3 hover:bg-blue-700 transition-colors duration-300"
          activeClassName="bg-blue-700"
          exact
        >
          <FaHome size={20} />
          <span className={`ml-4 text-sm ${showText ? 'block' : 'hidden'}`}>
            Home
          </span>
        </NavLink>
        <NavLink
          to="/precificacao"
          className="w-full flex items-center py-2 px-3 hover:bg-blue-700 transition-colors duration-300"
          activeClassName="bg-blue-700"
        >
          <FaDollarSign size={20} />
          <span className={`ml-4 text-sm ${showText ? 'block' : 'hidden'}`}>
            Precificação
          </span>
        </NavLink>
        <div className="relative group w-full">
          <div className="w-full flex items-center py-2 px-3 hover:bg-blue-700 cursor-pointer transition-colors duration-300 group-hover:shadow-lg group-hover:bg-blue-600">
            <FaFileAlt size={20} />
            <span className={`ml-4 text-sm ${showText ? 'block' : 'hidden'}`}>
              Formulários
            </span>
          </div>
          <div className="absolute left-full top-0 mt-2 w-48 bg-blue-800 text-white rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 overflow-hidden z-10">
            <NavLink
              to="/pricing"
              className="block px-3 py-2 hover:bg-blue-700 transition-colors duration-300 text-sm"
              activeClassName="bg-blue-700"
            >
              Precificação
            </NavLink>
            <NavLink
              to="/implantation"
              className="block px-3 py-2 hover:bg-blue-700 transition-colors duration-300 text-sm"
              activeClassName="bg-blue-700"
            >
              Implantação
            </NavLink>
          </div>
        </div>
        <NavLink
          to="/logout"
          className="w-full flex items-center py-2 px-3 hover:bg-blue-700 transition-colors duration-300"
          activeClassName="bg-blue-700"
        >
          <FaSignOutAlt size={20} />
          <span className={`ml-4 text-sm ${showText ? 'block' : 'hidden'}`}>
            Logout
          </span>
        </NavLink>
      </div>
    </div>
  );
};

export default SideBar;
