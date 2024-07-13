// src/pages/AdminPage.js
import React from 'react';
import PropTypes from 'prop-types';

const AdminPage = () => {
  return (
    <div>
      <h1>Administração</h1>
      <p>Bem-vindo à página de administração.</p>
    </div>
  );
};

AdminPage.propTypes = {
  user: PropTypes.shape({
    level: PropTypes.string.isRequired,
  }).isRequired,
};

export default AdminPage;
