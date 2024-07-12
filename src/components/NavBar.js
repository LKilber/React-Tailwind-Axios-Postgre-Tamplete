// src/components/NavBar.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from '../services/authService';
import '../styles/NavBar.css'; // Importa o CSS
import { FaSignOutAlt } from 'react-icons/fa'; // Importa o ícone

const NavBar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login'); // Redireciona para a página de login após o logoff
  };

  return (
    <nav className="navbar">
      <button onClick={handleLogout}>
        <FaSignOutAlt />
        Logoff
      </button>
    </nav>
  );
};

export default NavBar;
