// src/services/userService.js

import axios from 'axios';
import Cookies from 'js-cookie'; // Importa js-cookie para acessar o token

// Cria uma instância Axios com configuração padrão
const api = axios.create({
  baseURL: 'http://192.168.19.188:8000/user',
});

// Função utilitária para lidar com erros da API
const handleApiError = (error) => {
  if (error.response) {
    console.error('API Error:', error.response.data);
    throw new Error(`API request failed with status ${error.response.status}`);
  } else if (error.request) {
    console.error('No response received:', error.request);
    throw new Error('No response received from the API');
  } else {
    console.error('Error setting up request:', error.message);
    throw new Error('Error setting up request');
  }
};

// Função para obter o token de autenticação
const getAuthToken = () => {
  const token = Cookies.get('access_token');
  if (!token) {
    throw new Error('Authentication token not found');
  }
  return token;
};

// Function to create a user
export const createUser = async (userData) => {
  try {
    const response = await api.post('/create-user/', userData, {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    });
    return response;
  } catch (error) {
    handleApiError(error);
  }
};

// Function to fetch all users
export const fetchAllUsers = async () => {
  try {
    const response = await api.get('/users/', {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Function to update user status
export const updateUserStatus = async (userId, isActive) => {
  try {
    const response = await api.patch(
      `/users/${userId}/`, // Ensure the URL is correct and matches your backend endpoint
      {
        is_active: isActive,
      },
      {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};
