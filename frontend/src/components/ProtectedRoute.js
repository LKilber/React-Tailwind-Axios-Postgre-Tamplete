// src/components/ProtectedRoute.js

import React from 'react';
import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { CircularProgress, Box } from '@mui/material';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth(); // Adicionando o estado de loading

  // Verifica se ainda está carregando
  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  // Verifica se o usuário está autenticado
  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ProtectedRoute;
