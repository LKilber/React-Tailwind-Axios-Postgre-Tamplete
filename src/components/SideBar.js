import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  FaBars,
  FaHome,
  FaUser,
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
      className={`flex ${isOpen ? 'w-64' : 'w-20'} bg-gradient-to-r from-blue-600 to-blue-800 text-white min-h-full transition-all duration-300 shadow-lg`}
    >
      <div className="flex flex-col items-center w-full">
        <button
          onClick={toggleSidebar}
          className="text-white focus:outline-none mt-4"
        >
          <FaBars size={24} />
        </button>
        {isOpen && (
          <div className="flex flex-col items-center mt-6 space-y-4 w-full">
            <NavLink
              to="/home"
              className="flex items-center w-full px-4 py-2 rounded hover:bg-blue-700 transition-colors duration-200"
              activeClassName="bg-blue-700"
              exact
            >
              <FaHome className="mr-3" />
              <span>Home</span>
            </NavLink>
            <NavLink
              to="/profile"
              className="flex items-center w-full px-4 py-2 rounded hover:bg-blue-700 transition-colors duration-200"
              activeClassName="bg-blue-700"
            >
              <FaUser className="mr-3" />
              <span>Perfil</span>
            </NavLink>
            <NavLink
              to="/help"
              className="flex items-center w-full px-4 py-2 rounded hover:bg-blue-700 transition-colors duration-200"
              activeClassName="bg-blue-700"
            >
              <FaQuestionCircle className="mr-3" />
              <span>Ajuda</span>
            </NavLink>
            <div className="relative group w-full">
              <div className="flex items-center justify-between w-full px-4 py-2 rounded hover:bg-blue-700 cursor-pointer transition-colors duration-200 group-hover:shadow-lg group-hover:bg-blue-600">
                <div className="flex items-center">
                  <FaFileAlt className="mr-3" />
                  <span>Formulários</span>
                </div>
                <FaChevronRight className="transform group-hover:rotate-90 transition-transform duration-300" />
              </div>
              <div className="absolute left-full top-0 mt-2 w-48 bg-blue-800 text-white rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 overflow-hidden">
                <NavLink
                  to="/pricing"
                  className="block px-4 py-2 hover:bg-blue-700 transition-colors duration-200"
                  activeClassName="bg-blue-700"
                >
                  Precificação
                </NavLink>
                <NavLink
                  to="/implantation"
                  className="block px-4 py-2 hover:bg-blue-700 transition-colors duration-200"
                  activeClassName="bg-blue-700"
                >
                  Implantação
                </NavLink>
              </div>
            </div>
            <NavLink
              to="/logout"
              className="flex items-center w-full px-4 py-2 rounded hover:bg-blue-700 transition-colors duration-200"
              activeClassName="bg-blue-700"
            >
              <FaSignOutAlt className="mr-3" />
              <span>Logout</span>
            </NavLink>
          </div>
        )}
      </div>
    </div>
  );
};

export default SideBar;
