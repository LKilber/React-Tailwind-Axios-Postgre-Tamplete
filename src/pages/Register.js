import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../services/authService';
import AuthLayout from '../layouts/AuthLayout';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await register({ username, email, password });
      navigate('/login');
    } catch (error) {
      setError('Failed to create account. Please try again.');
    }
  };

  const handleBackToLogin = () => {
    navigate('/login');
  };

  return (
    <AuthLayout>
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-full max-w-md bg-blue-500 p-8 rounded-lg shadow-lg">
          <div className="text-center mb-6">
            <h2 className="text-4xl font-bold text-white">Create Account</h2>
          </div>
          <form onSubmit={handleRegister} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-white">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            {error && <p className="text-red-500 text-center">{error}</p>}
            <button
              type="submit"
              className="w-full py-3 bg-gray-800 text-white rounded-lg font-semibold text-center hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Register
            </button>
          </form>
          <button
            onClick={handleBackToLogin}
            className="mt-4 w-full py-3 bg-gray-700 text-white rounded-lg font-semibold text-center hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-600"
          >
            Back to Login
          </button>
        </div>
      </div>
    </AuthLayout>
  );
};

export default Register;
