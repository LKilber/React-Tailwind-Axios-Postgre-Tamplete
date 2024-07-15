// src/services/authService.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://192.168.19.183:5001',
});

export const login = async (credentials) => {
  try {
    const response = await api.post('/auth/login', credentials);
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
    return response.data.user;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      throw new Error('Invalid credentials');
    } else {
      throw new Error('An error occurred during login');
    }
  }
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  console.log(localStorage.getItem('user'));
};
