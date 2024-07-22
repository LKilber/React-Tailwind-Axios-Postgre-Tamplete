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

// Simulated login for development purposes
export const simulateLogin = () => {
  const simulatedUser = {
    id: 1,
    username: 'testuser',
    email: 'testuser@example.com',
    roles: ['user'],
  };

  const simulatedAccessToken = 'simulatedAccessToken';
  const simulatedRefreshToken = 'simulatedRefreshToken';

  // Store the simulated tokens and user data
  localStorage.setItem('access', simulatedAccessToken);
  localStorage.setItem('refresh', simulatedRefreshToken);
  localStorage.setItem('user', JSON.stringify(simulatedUser));

  return simulatedUser;
};
