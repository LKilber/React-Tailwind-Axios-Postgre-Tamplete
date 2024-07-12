// src/hooks/useAuth.js
import { useContext, useState, useEffect } from 'react';
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
    try {
      const user = await loginService(credentials);
      setUser(user);
    } catch (err) {
      console.error('Error logging in:', err);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    logoutService();
    setUser(null);
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (err) {
        console.error('Failed to parse user from localStorage:', err);
      }
    }
  }, [setUser]);

  return { user, setUser, loading, login, logout };
};

export default useAuth;
