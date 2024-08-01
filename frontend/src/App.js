// src/App.js
import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import MainLayout from './layouts/MainLayout';
import './styles/MainLayout.css';

import Home from './pages/Home';
import Login from './pages/Login';
import Implantation from './pages/Implantation';
import Tickets from './pages/Tickets';
import ProtectedRoute from './components/ProtectedRoute';
import CreateUser from './pages/CreateUser';
import Users from './pages/Users';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Home />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/implantation"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Implantation />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/tickets"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Tickets />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/createuser"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <CreateUser />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Users />
                </MainLayout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
