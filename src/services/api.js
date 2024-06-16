// src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.example.com',
});

export const getData = async (endpoint) => {
  try {
    const response = await api.get(endpoint);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const postData = async (endpoint, data) => {
  try {
    const response = await api.post(endpoint, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};
