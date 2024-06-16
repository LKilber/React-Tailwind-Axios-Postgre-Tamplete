// src/hooks/useAuth.js
import { useContext, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import {
  login as loginService,
  logout as logoutService,
} from '../services/authService';

const useAuth = () => {
  const { user, setUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  const login = async (credentials) => {
    setLoading(true);
    const user = await loginService(credentials);
    setUser(user);
    setLoading(false);
  };

  const logout = () => {
    logoutService();
    setUser(null);
  };

  return { user, setUser, loading, login, logout };
};

export default useAuth;
