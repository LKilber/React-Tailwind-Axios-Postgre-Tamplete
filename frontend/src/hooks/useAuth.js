// hooks/useAuth.js

import { useState, useEffect, useCallback } from 'react';
import {
  login as loginService,
  logout as logoutService,
  isAuthenticated,
} from '../services/authService';
import Cookies from 'js-cookie';

const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = useCallback(async (credentials) => {
    setLoading(true);
    try {
      const { user } = await loginService(credentials);
      setUser(user);
    } catch (err) {
      console.error('Error logging in:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    logoutService();
    setUser(null);
  }, []);

  useEffect(() => {
    const storedUser = Cookies.get('user');
    const accessToken = Cookies.get('access_token');

    if (storedUser && accessToken && isAuthenticated()) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (err) {
        console.error('Failed to parse user from Cookies:', err);
        logoutService(); // Clear possibly corrupted data
      }
    }
    setLoading(false);
  }, []);

  return { user, loading, login, logout };
};

export default useAuth;
