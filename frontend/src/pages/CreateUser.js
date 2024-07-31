import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
} from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledContainer = styled(Container)(({ theme }) => ({
  padding: theme.spacing(3),
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginTop: theme.spacing(3),
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

const StyledButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
}));

const CreateUser = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [sector, setSector] = useState('');
  const [role, setRole] = useState('');
  const [level, setLevel] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    try {
      const response = await axios.post(
        'http://192.168.19.182:8000/user/create-user/',
        {
          username,
          email,
          password,
          sector,
          role,
          level,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        },
      );

      if (response.status === 201) {
        navigate('/users'); // Redirect to the users list or another page
      }
    } catch (error) {
      setError('Error creating user. Please try again.');
    }
  };

  return (
    <StyledContainer maxWidth="sm">
      <StyledPaper elevation={3}>
        <Typography variant="h4" component="h1" gutterBottom>
          Create User
        </Typography>
        <form onSubmit={handleSubmit} className="create-user-form">
          <StyledTextField
            label="Username"
            variant="outlined"
            fullWidth
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <StyledTextField
            label="Email"
            type="email"
            variant="outlined"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <StyledTextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <StyledTextField
            label="Sector"
            variant="outlined"
            fullWidth
            value={sector}
            onChange={(e) => setSector(e.target.value)}
          />
          <StyledTextField
            label="Role"
            variant="outlined"
            fullWidth
            value={role}
            onChange={(e) => setRole(e.target.value)}
          />
          <StyledTextField
            label="Level"
            variant="outlined"
            fullWidth
            value={level}
            onChange={(e) => setLevel(e.target.value)}
          />
          {error && <Alert severity="error">{error}</Alert>}
          <StyledButton
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
          >
            Create User
          </StyledButton>
        </form>
      </StyledPaper>
    </StyledContainer>
  );
};

export default CreateUser;
