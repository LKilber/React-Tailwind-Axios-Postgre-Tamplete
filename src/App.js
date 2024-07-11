// src/App.js
import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import './styles/MainLayout.css'; // Adicionando a importação do CSS

// Importing components directly
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Implantation from './pages/Implantation';
import Pricing from './pages/Pricing';
import ViewPricing from './pages/ViewPricing';
import Tickets from './pages/Tickets';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route
          path="/home"
          element={
            <MainLayout>
              <Home />
            </MainLayout>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route
          path="/register"
          element={
            <MainLayout>
              <Register />
            </MainLayout>
          }
        />
        <Route
          path="/implantation"
          element={
            <MainLayout>
              <Implantation />
            </MainLayout>
          }
        />
        <Route
          path="/precificacao"
          element={
            <MainLayout>
              <Pricing />
            </MainLayout>
          }
        />
        <Route
          path="/viewpricing"
          element={
            <MainLayout>
              <ViewPricing />
            </MainLayout>
          }
        />
        <Route
          path="/tickets"
          element={
            <MainLayout>
              <Tickets />
            </MainLayout>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
