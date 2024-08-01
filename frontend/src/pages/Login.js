// pages/Login.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import AuthLayout from '../layouts/AuthLayout';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  Avatar,
  CircularProgress,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import loginBackground from '../assets/back2.mp4'; // Ensure the correct path to your video file
import '../styles/Login.css'; // Ensure to import your CSS file

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, loading } = useAuth(); // Usando loading do useAuth hook
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login({ username, password });
      navigate('/home');
    } catch (error) {
      setError(
        'Login falhou. Verifique seu nome de usuário e senha e tente novamente.',
      );
    }
  };

  return (
    <AuthLayout>
      <video autoPlay loop muted className="video-background">
        <source src={loginBackground} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="centered-container">
        <Container component="main" maxWidth="xs">
          <Paper
            elevation={6}
            sx={{
              padding: 4,
              borderRadius: 2,
              backgroundColor: '#1c1c1e', // Dark background color
              color: '#ffffff', // White text color
            }}
          >
            <Box display="flex" flexDirection="column" alignItems="center">
              <Avatar sx={{ m: 1, bgcolor: '#424242' }}>
                <LockOutlinedIcon />
              </Avatar>
              <Typography component="h1" variant="h5">
                Login
              </Typography>
              <Box
                component="form"
                onSubmit={handleLogin}
                noValidate
                sx={{ mt: 1 }}
              >
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="username"
                  label="Username"
                  name="username"
                  autoComplete="username"
                  autoFocus
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  InputProps={{
                    style: { color: '#ffffff' }, // Text color
                  }}
                  InputLabelProps={{
                    style: { color: '#8c8c8e' }, // Label color
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: '#424242', // Border color
                      },
                      '&:hover fieldset': {
                        borderColor: '#616161', // Hover border color
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#757575', // Focused border color
                      },
                    },
                  }}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  InputProps={{
                    style: { color: '#ffffff' }, // Text color
                  }}
                  InputLabelProps={{
                    style: { color: '#8c8c8e' }, // Label color
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: '#424242', // Border color
                      },
                      '&:hover fieldset': {
                        borderColor: '#616161', // Hover border color
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#757575', // Focused border color
                      },
                    },
                  }}
                />
                {error && (
                  <Typography color="error" align="center">
                    {error}
                  </Typography>
                )}
                <Box sx={{ position: 'relative', mt: 3, mb: 2 }}>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    disabled={loading}
                    sx={{
                      backgroundColor: '#424242', // Button background color
                      color: '#ffffff', // Button text color
                      '&:hover': {
                        backgroundColor: '#616161', // Hover background color
                      },
                    }}
                  >
                    {loading ? (
                      <CircularProgress size={24} sx={{ color: '#ffffff' }} />
                    ) : (
                      'Login'
                    )}
                  </Button>
                </Box>
              </Box>
            </Box>
          </Paper>
        </Container>
      </div>
    </AuthLayout>
  );
};

export default Login;
