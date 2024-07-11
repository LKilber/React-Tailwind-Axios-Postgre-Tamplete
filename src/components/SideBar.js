import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import {
  FaBars,
  FaHome,
  FaDollarSign,
  FaChevronLeft,
  FaChevronDown,
  FaTicketAlt,
} from 'react-icons/fa';
import '../styles/SideBar.css';
import logo from '../assets/logo.png';

const SideBar = ({ isOpen, onToggle }) => {
  const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);

  const handleSubMenuToggle = () => {
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
        <NavLink to="/tickets" exact activeClassName="active">
          <FaTicketAlt size={20} />
          <span>Tickets</span>
        </NavLink>
        <div className="sidebar__submenu">
          <button className="submenu__toggle" onClick={handleSubMenuToggle}>
            <FaDollarSign size={20} />
            <span>Precificação</span>
            <FaChevronDown
              className={`submenu__icon ${isSubMenuOpen ? 'open' : ''}`}
            />
          </button>
          <div className={`submenu__content ${isSubMenuOpen ? 'open' : ''}`}>
            <NavLink to="/precificacao" activeClassName="active">
              <FaDollarSign size={20} />
              <span>Precificação</span>
            </NavLink>
            <NavLink to="/viewpricing" activeClassName="active">
              <FaDollarSign size={20} />
              <span>Ver Precificações</span>
            </NavLink>
          </div>
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
