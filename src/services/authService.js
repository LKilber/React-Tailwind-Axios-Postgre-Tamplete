// src/services/authService.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

export const login = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  localStorage.setItem('token', response.data.token);
  localStorage.setItem('user', JSON.stringify(response.data.user));
  return response.data.user;
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const register = async (userInfo) => {
  const response = await api.post('/auth/register', userInfo);
  return response.data;
};
