import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import {
  FaBars,
  FaHome,
  FaDollarSign,
  FaChevronLeft,
  FaChevronDown,
  FaTicketAlt,
  FaTools,
} from 'react-icons/fa';
import '../styles/SideBar.css';

const SideBar = ({ isOpen, onToggle }) => {
  const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);
  const { user } = useContext(AuthContext);

  const handleSubMenuToggle = () => {
    setIsSubMenuOpen(!isSubMenuOpen);
  };

  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
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
        {user && user.level === 'Admin' && (
          <NavLink to="/admin" exact activeClassName="active">
            <FaTools size={20} />
            <span>Admin</span>
          </NavLink>
        )}
      </nav>
    </div>
  );
};

SideBar.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
};

export default SideBar;
