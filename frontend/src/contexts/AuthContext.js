// contexts/AuthContext.js

import React, { createContext } from 'react';
import PropTypes from 'prop-types';
import useAuth from '../hooks/useAuth';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const { user, setUser, login, logout, loading } = useAuth();

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
