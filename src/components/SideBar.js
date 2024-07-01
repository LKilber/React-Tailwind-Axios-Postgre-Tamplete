import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  FaBars,
  FaHome,
  FaQuestionCircle,
  FaSignOutAlt,
  FaFileAlt,
  FaChevronRight,
} from 'react-icons/fa';

const SideBar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div
      className={`flex ${isOpen ? 'w-48' : 'w-11'} bg-blue-900 text-white min-h-screen transition-all duration-500 ease-in-out shadow-lg`}
    >
      <div className="flex flex-col items-center w-full">
        <button
          onClick={toggleSidebar}
          className="text-white focus:outline-none mt-4 transition-transform duration-500 ease-in-out transform hover:rotate-90"
        >
          <FaBars size={14} />
        </button>
        <div className="flex flex-col items-center mt-6 space-y-2 w-full">
          <NavLink
            to="/home"
            className="flex items-center w-full px-3 py-2 rounded hover:bg-blue-700 transition-colors duration-300"
            activeClassName="bg-blue-700"
            exact
          >
            <FaHome className="mr-3" />
            <span
              className={`transition-opacity duration-300 ${isOpen ? 'opacity-100 delay-300' : 'opacity-0'}`}
            >
              Home
            </span>
          </NavLink>
          <NavLink
            to="/precificacao"
            className="flex items-center w-full px-3 py-2 rounded hover:bg-blue-700 transition-colors duration-300"
            activeClassName="bg-blue-700"
          >
            <FaQuestionCircle className="mr-3" />
            <span
              className={`transition-opacity duration-300 ${isOpen ? 'opacity-100 delay-300' : 'opacity-0'}`}
            >
              Precificação
            </span>
          </NavLink>
          <div className="relative group w-full">
            <div className="flex items-center justify-between w-full px-3 py-2 rounded hover:bg-blue-700 cursor-pointer transition-colors duration-300 group-hover:shadow-lg group-hover:bg-blue-600">
              <div className="flex items-center">
                <FaFileAlt className="mr-3" />
                <span
                  className={`transition-opacity duration-300 ${isOpen ? 'opacity-100 delay-300' : 'opacity-0'}`}
                >
                  Formulários
                </span>
              </div>
              {isOpen && (
                <FaChevronRight className="transform group-hover:rotate-90 transition-transform duration-300" />
              )}
            </div>
            <div className="absolute left-full top-0 mt-2 w-48 bg-blue-800 text-white rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 overflow-hidden z-10">
              <NavLink
                to="/pricing"
                className="block px-3 py-2 hover:bg-blue-700 transition-colors duration-300"
                activeClassName="bg-blue-700"
              >
                Precificação
              </NavLink>
              <NavLink
                to="/implantation"
                className="block px-3 py-2 hover:bg-blue-700 transition-colors duration-300"
                activeClassName="bg-blue-700"
              >
                Implantação
              </NavLink>
            </div>
          </div>
          <NavLink
            to="/logout"
            className="flex items-center w-full px-3 py-2 rounded hover:bg-blue-700 transition-colors duration-300"
            activeClassName="bg-blue-700"
          >
            <FaSignOutAlt className="mr-3" />
            <span
              className={`transition-opacity duration-300 ${isOpen ? 'opacity-100 delay-300' : 'opacity-0'}`}
            >
              Logout
            </span>
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
