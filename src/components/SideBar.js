import React, { useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { FaBars, FaHome, FaDollarSign, FaChevronLeft } from 'react-icons/fa';
import logo from '../assets/theweslley.png'; // Caminho para a sua logo
import '../styles/SideBar.css'; // Importe o arquivo CSS personalizado

const SideBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showText, setShowText] = useState(false);
  const [showLogos, setShowLogos] = useState(false);
  const [logoPositions, setLogoPositions] = useState([]);
  const buttonRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => setShowText(true), 300);
      return () => clearTimeout(timer);
    } else {
      setShowText(false);
    }
  }, [isOpen]);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handlePrecificacaoClick = () => {
    if (buttonRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect();
      const positions = Array.from({ length: 10 }).map(() => ({
        top: buttonRect.top + window.scrollY,
        left: buttonRect.left + window.scrollX,
      }));
      setLogoPositions(positions);
      setShowLogos(true);
      setTimeout(() => setShowLogos(false), 3000);
    }
  };

  return (
    <div
      className={`flex flex-col ${isOpen ? 'w-36' : 'w-12'} bg-blue-900 text-white min-h-screen transition-all duration-300 ease-in-out shadow-lg`}
    >
      <div className="flex flex-col items-center mt-4 space-y-2">
        <button
          onClick={toggleSidebar}
          className="text-white focus:outline-none w-full flex justify-center py-4 hover:bg-blue-700 transition-colors duration-300"
        >
          {isOpen ? <FaChevronLeft size={20} /> : <FaBars size={20} />}
        </button>
        <NavLink
          to="/home"
          className="w-full flex items-center py-2 px-4 hover:bg-blue-700 transition-colors duration-300"
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
          className="w-full flex items-center py-2 px-4 hover:bg-blue-700 transition-colors duration-300"
          activeClassName="bg-blue-700"
          onClick={handlePrecificacaoClick}
          ref={buttonRef}
        >
          <FaDollarSign size={20} />
          <span className={`ml-4 text-sm ${showText ? 'block' : 'hidden'}`}>
            Precificação
          </span>
        </NavLink>
      </div>
      {showLogos && (
        <div className="logos-container">
          {logoPositions.map((pos, index) => (
            <img
              key={index}
              src={logo}
              alt="Logo"
              className="spinning-logo"
              style={{ top: `${pos.top}px`, left: `${pos.left}px` }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SideBar;
