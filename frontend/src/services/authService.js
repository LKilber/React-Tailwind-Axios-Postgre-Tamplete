// services/authService.js

import axios from 'axios';
import Cookies from 'js-cookie';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://192.168.19.188:8000',
});

// Set to true during development to use a fake user
const useFakeUser = false;

// Define a fake user object for development
const fakeUser = {
  username: 'fakeuser',
  email: 'fakeuser@example.com',
  role: 'developer',
  // Add any additional fields your app might expect
};

const handleApiError = (error) => {
  if (error.response) {
    if (error.response.status === 401) {
      throw new Error('Invalid credentials');
    } else {
      throw new Error(`Request failed with status: ${error.response.status}`);
    }
  } else {
    throw new Error('An error occurred during the request');
  }
};

// Function to check token expiration
const checkTokenExpiration = (token) => {
  try {
    const decodedToken = JSON.parse(atob(token.split('.')[1]));
    const expirationTime = decodedToken.exp * 1000;
    return expirationTime > Date.now();
  } catch (error) {
    console.error('Invalid token', error);
    return false;
  }
};

// Login function
export const login = async (credentials) => {
  console.log(credentials);

  if (useFakeUser) {
    // Use the fake user for development
    console.log('Using fake user for development');
    const fakeAccessToken = 'fake-access-token';
    Cookies.set('access_token', fakeAccessToken, {
      expires: 7,
      secure: true,
      sameSite: 'Strict',
    });
    Cookies.set('user', JSON.stringify(fakeUser), {
      expires: 7,
      secure: true,
      sameSite: 'Strict',
    });

    return { accessToken: fakeAccessToken, user: fakeUser };
  }

  try {
    const response = await api.post('/auth/login/', credentials);
    const accessToken = response.data.access;

    if (checkTokenExpiration(accessToken)) {
      Cookies.set('access_token', accessToken, {
        expires: 7,
        secure: true,
        sameSite: 'Strict',
      });
      const user = await getUserInfo(accessToken);
      Cookies.set('user', JSON.stringify(user), {
        expires: 7,
        secure: true,
        sameSite: 'Strict',
      });

      return { accessToken, user };
    } else {
      throw new Error('Token expired');
    }
  } catch (error) {
    handleApiError(error);
  }
};

// Logout function
export const logout = () => {
  Cookies.remove('access_token');
  Cookies.remove('user');
};

// Check if authenticated
export const isAuthenticated = () => {
  const token = Cookies.get('access_token');
  return token && checkTokenExpiration(token);
};

// Get user info
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
