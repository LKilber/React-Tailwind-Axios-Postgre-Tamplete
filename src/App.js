// src/App.js
import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from 'react-router-dom';
import MainLayout from './layouts/MainLayout';

// Importing components directly
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Implantation from './pages/Implantation';
import Pricing from './pages/Pricing';
import MiniGame from './pages/MiniGame';

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
        <Route path="/minigame" element={<MiniGame />} />
      </Routes>
    </Router>
  );
};

export default App;
