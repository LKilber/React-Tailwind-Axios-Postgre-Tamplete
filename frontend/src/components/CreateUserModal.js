import React, { useState } from 'react';
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Fade,
  Snackbar,
  Alert,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { createUser } from '../services/userService';
import PropTypes from 'prop-types';
import {
  AccountCircle,
  Email,
  Lock,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';

const StyledBox = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90%',
  maxWidth: 500,
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[5],
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(4),
  outline: 'none',
  transition: 'transform 0.3s ease-out',
}));

const GridContainer = styled('div')(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(1, 1fr)', // Single column for individual fields
  gap: theme.spacing(2),
  marginBottom: theme.spacing(2),
}));

const DropdownContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(2),
  marginBottom: theme.spacing(2),
}));

const CreateUserModal = ({ open, onClose, onUserAdded }) => {
  const [formValues, setFormValues] = useState({
    fullName: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    sector: '',
    role: '',
    level: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (formValues.password !== formValues.confirmPassword) {
      setError('As senhas não coincidem. Por favor, verifique novamente.');
      return;
    }

    try {
      const response = await createUser(formValues);

      if (response.status === 201) {
        setSuccess(true);
        onUserAdded();
        setTimeout(() => {
          onClose();
          setSuccess(false);
        }, 2000);
      }
    } catch (error) {
      setError('Erro ao criar usuário. Por favor, tente novamente.');
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const passwordIsValid = (password) => {
    // Example password validation: at least 8 characters, including a number and a special character
    const regex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    return regex.test(password);
  };

  return (
    <>
      <Modal
        open={open}
        onClose={onClose}
        closeAfterTransition
        aria-labelledby="add-user-modal"
        aria-describedby="formulario-para-criar-novo-usuario"
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <StyledBox>
            <Typography variant="h6" gutterBottom>
              Criar Usuário
            </Typography>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            <form onSubmit={handleSubmit}>
              <GridContainer>
                {/* Nome Completo */}
                <TextField
                  label="Nome Completo"
                  type="text"
                  variant="outlined"
                  name="fullName"
                  value={formValues.fullName}
                  onChange={handleChange}
                  required
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AccountCircle />
                      </InputAdornment>
                    ),
                  }}
                />

                {/* Email */}
                <TextField
                  label="Email"
                  type="email"
                  variant="outlined"
                  name="email"
                  value={formValues.email}
                  onChange={handleChange}
                  required
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email />
                      </InputAdornment>
                    ),
                  }}
                />

                {/* Usuário */}
                <TextField
                  label="Usuário"
                  type="text"
                  variant="outlined"
                  name="username"
                  value={formValues.username}
                  onChange={handleChange}
                  required
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AccountCircle />
                      </InputAdornment>
                    ),
                  }}
                />

                {/* Senha */}
                <TextField
                  label="Senha"
                  type={showPassword ? 'text' : 'password'}
                  variant="outlined"
                  name="password"
                  value={formValues.password}
                  onChange={handleChange}
                  required
                  fullWidth
                  error={
                    formValues.password && !passwordIsValid(formValues.password)
                  }
                  helperText={
                    formValues.password && !passwordIsValid(formValues.password)
                      ? 'A senha deve ter pelo menos 8 caracteres, incluindo um número e um caractere especial.'
                      : ''
                  }
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={handleClickShowPassword}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                {/* Confirmação de Senha */}
                <TextField
                  label="Confirmação de Senha"
                  type={showPassword ? 'text' : 'password'}
                  variant="outlined"
                  name="confirmPassword"
                  value={formValues.confirmPassword}
                  onChange={handleChange}
                  required
                  fullWidth
                  error={
                    formValues.confirmPassword &&
                    formValues.password !== formValues.confirmPassword
                  }
                  helperText={
                    formValues.confirmPassword &&
                    formValues.password !== formValues.confirmPassword
                      ? 'As senhas não coincidem.'
                      : ''
                  }
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={handleClickShowPassword}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </GridContainer>

              {/* Dropdowns in a Single Line */}
              <DropdownContainer>
                <FormControl variant="outlined" fullWidth>
                  <InputLabel id="sector-label">Setor</InputLabel>
                  <Select
                    labelId="sector-label"
                    name="sector"
                    value={formValues.sector}
                    onChange={handleChange}
                    label="Setor"
                    required
                  >
                    <MenuItem value="Preço&Risco">Preço&Risco</MenuItem>
                    <MenuItem value="Financeiro">Financeiro</MenuItem>
                    <MenuItem value="Comercial">Comercial</MenuItem>
                    <MenuItem value="Operação">Operação</MenuItem>
                    <MenuItem value="Tecnologia">Tecnologia</MenuItem>
                  </Select>
                </FormControl>

                <FormControl variant="outlined" fullWidth>
                  <InputLabel id="role-label">Cargo</InputLabel>
                  <Select
                    labelId="role-label"
                    name="role"
                    value={formValues.role}
                    onChange={handleChange}
                    label="Cargo"
                    required
                  >
                    <MenuItem value="Analista">Analista</MenuItem>
                    <MenuItem value="Assistente">Assistente</MenuItem>
                    <MenuItem value="Gerente">Gerente</MenuItem>
                    <MenuItem value="Coordenador">Coordenador</MenuItem>
                    <MenuItem value="Diretor">Diretor</MenuItem>
                  </Select>
                </FormControl>

                <FormControl variant="outlined" fullWidth>
                  <InputLabel id="level-label">Nível</InputLabel>
                  <Select
                    labelId="level-label"
                    name="level"
                    value={formValues.level}
                    onChange={handleChange}
                    label="Nível"
                    required
                  >
                    <MenuItem value="Administrador">Administrador</MenuItem>
                    <MenuItem value="Usuário">Usuário</MenuItem>
                  </Select>
                </FormControl>
              </DropdownContainer>

              <Button
                variant="contained"
                color="primary"
                fullWidth
                type="submit"
                sx={{ mt: 2 }}
              >
                Adicionar
              </Button>
            </form>
          </StyledBox>
        </Fade>
      </Modal>
      <Snackbar
        open={success}
        autoHideDuration={2000}
        onClose={() => setSuccess(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSuccess(false)}
          severity="success"
          sx={{ width: '100%' }}
        >
          Usuário criado com sucesso!
        </Alert>
      </Snackbar>
    </>
  );
};

// Define prop types for CreateUserModal
CreateUserModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onUserAdded: PropTypes.func.isRequired,
};

export default CreateUserModal;
