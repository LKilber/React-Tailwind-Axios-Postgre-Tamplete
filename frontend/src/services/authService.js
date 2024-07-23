// services/authService.js

import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000',
});

export const login = async (credentials) => {
  try {
    const response = await api.post('/auth/login/', credentials);
    const accessToken = response.data.access;
    localStorage.setItem('access_token', accessToken);

    const user = await getUserInfo(accessToken);
    localStorage.setItem('user', JSON.stringify(user));

    return { accessToken, user };
  } catch (error) {
    if (error.response) {
      if (error.response.status === 401) {
        throw new Error('Invalid credentials');
      } else {
        throw new Error(`Login failed with status: ${error.response.status}`);
      }
    } else {
      throw new Error('An error occurred during login');
    }
  }
};

export const logout = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('user');
};

export const isAuthenticated = () => {
  return !!localStorage.getItem('access_token');
};

export const getUserInfo = async (token) => {
  try {
    const response = await api.get('/user/me/', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch user info', error);
    throw error;
  }
};
