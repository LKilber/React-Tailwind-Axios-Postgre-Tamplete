import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
});

export const login = async (credentials) => {
  try {
    const response = await api.post('/auth/login/', credentials);

    // Store the access token and optionally the refresh token
    localStorage.setItem('access', response.data.access);
    localStorage.setItem('refresh', response.data.refresh);

    // Extract user information from the access token payload
    const user = JSON.parse(atob(response.data.access.split('.')[1]));
    localStorage.setItem('user', JSON.stringify(user));
    console.log(user);
    return user;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      throw new Error('Invalid credentials');
    } else {
      throw new Error('An error occurred during login');
    }
  }
};

export const logout = () => {
  localStorage.removeItem('access');
  localStorage.removeItem('refresh');
  localStorage.removeItem('user');
  console.log(localStorage.getItem('user'));
};
