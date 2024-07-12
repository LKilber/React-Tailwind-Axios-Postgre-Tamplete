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
import Pricing from './pages/Pricing';
import ViewPricing from './pages/ViewPricing';
import Tickets from './pages/Tickets';
import ProtectedRoute from './components/ProtectedRoute';
import Admin from './pages/Admin';

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
            path="/precificacao"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Pricing />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/viewpricing"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <ViewPricing />
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
            path="/admin"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Admin />
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
