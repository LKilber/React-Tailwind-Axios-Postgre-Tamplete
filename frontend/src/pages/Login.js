import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import AuthLayout from '../layouts/AuthLayout';

const Login = () => {
  const [cpf, setCpf] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login({ cpf, password });
      navigate('/home');
    } catch (error) {
      setError('Invalid credentials');
    }
  };

  return (
    <AuthLayout>
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-full max-w-md bg-blue-500 p-8 rounded-lg shadow-lg">
          <div className="text-center mb-6">
            <h2 className="text-4xl font-bold text-white">Login</h2>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-white">
                cpf
              </label>
              <input
                type="text"
                value={cpf}
                onChange={(e) => setCpf(e.target.value)}
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
              Login
            </button>
          </form>
        </div>
      </div>
    </AuthLayout>
  );
};

export default Login;
