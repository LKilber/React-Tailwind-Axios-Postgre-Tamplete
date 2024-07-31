import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import {
  FaBars,
  FaHome,
  FaDollarSign,
  FaChevronLeft,
  FaTicketAlt,
  FaTools,
} from 'react-icons/fa';
import { BsPersonFillAdd } from 'react-icons/bs';
import '../styles/SideBar.css';

const SideBar = ({ isOpen, onToggle }) => {
  const [isPrecificacaoSubMenuOpen, setIsPrecificacaoSubMenuOpen] =
    useState(false);
  const [isGerenciamentoSubMenuOpen, setIsGerenciamentoSubMenuOpen] =
    useState(false);
  const { user } = useContext(AuthContext);

  const handlePrecificacaoSubMenuToggle = () => {
    setIsPrecificacaoSubMenuOpen(!isPrecificacaoSubMenuOpen);
  };

  const handleGerenciamentoSubMenuToggle = () => {
    setIsGerenciamentoSubMenuOpen(!isGerenciamentoSubMenuOpen);
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
          <button
            className="submenu__toggle"
            onClick={handlePrecificacaoSubMenuToggle}
          >
            <FaDollarSign size={20} />
            <span>Precificação</span>
          </button>
          <div
            className={`submenu__content ${isPrecificacaoSubMenuOpen ? 'open' : ''}`}
          >
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
          <div className="sidebar__submenu">
            <button
              className="submenu__toggle"
              onClick={handleGerenciamentoSubMenuToggle}
            >
              <FaTools size={20} />
              <span>Gerenciamento</span>
            </button>
            <div
              className={`submenu__content ${isGerenciamentoSubMenuOpen ? 'open' : ''}`}
            >
              <NavLink to="/createuser" activeClassName="active">
                <BsPersonFillAdd size={20} />
                <span>Criar Usuário</span>
              </NavLink>
            </div>
          </div>
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
