import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import {
  FaBars,
  FaHome,
  FaDollarSign,
  FaChevronLeft,
  FaChevronDown,
} from 'react-icons/fa';
import '../styles/SideBar.css';
import logo from '../assets/logo.png';

const SideBar = ({ isOpen, onToggle }) => {
  const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);

  const toggleSubMenu = () => {
    setIsSubMenuOpen(!isSubMenuOpen);
  };

  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar__logo">
        <img src={logo} alt="Logo" />
      </div>
      <button onClick={onToggle} className="sidebar__toggle">
        {isOpen ? <FaChevronLeft size={20} /> : <FaBars size={20} />}
      </button>
      <nav className="sidebar__nav">
        <NavLink to="/home" exact activeClassName="active">
          <FaHome size={20} />
          <span>Home</span>
        </NavLink>
        <NavLink to="/precificacao" activeClassName="active">
          <FaDollarSign size={20} />
          <span>Precificação</span>
        </NavLink>
        <div className="sidebar__submenu">
          <button onClick={toggleSubMenu} className="submenu__toggle">
            <FaChevronDown size={20} />
            <span>Mais</span>
          </button>
          {isSubMenuOpen && (
            <div className="submenu__content">
              <NavLink to="/opcao1" activeClassName="active">
                <span>Opção 1</span>
              </NavLink>
              <NavLink to="/opcao2" activeClassName="active">
                <span>Opção 2</span>
              </NavLink>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
};

SideBar.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
};

export default SideBar;
