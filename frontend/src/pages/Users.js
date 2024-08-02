// src/pages/Users.js

import React, { useState, useEffect } from 'react';
import { Typography, CircularProgress, Box, Alert } from '@mui/material';
import { fetchAllUsers, updateUserStatus } from '../services/userService'; // Import the service
import CreateUserModal from '../components/CreateUserModal'; // Import the new component
import CustomSwitch from '../components/StyledSwitch'; // Import the styled switch
import CustomButton from '../components/StyledButton';
import '../styles/Users.css'; // Import the CSS file

const Users = () => {
  const [users, setUsers] = useState([]); // Ensure this is initialized as an empty array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openModal, setOpenModal] = useState(false); // State for modal control

  const fetchUsers = async () => {
    setLoading(true);
    setError('');

    try {
      const usersData = await fetchAllUsers();
      console.log(usersData);
      setUsers(usersData || []); // Ensure users is always an array
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (userId, isActive) => {
    try {
      await updateUserStatus(userId, !isActive); // Call the service to update the user's status
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, is_active: !isActive } : user,
        ),
      );
    } catch (err) {
      setError('Failed to update user status. Please try again.');
      console.log(err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleUserAdded = () => {
    console.log('Responsável adicionado com sucesso!');
    fetchUsers();
  };

  const items = [
    { label: 'Adicionar Usuário', onClick: () => handleOpenModal() },
    { label: 'Item 2', onClick: () => alert('Item 2 clicked') },
    { label: 'Item 3', onClick: () => alert('Item 3 clicked') },
  ];

  return (
    <Box>
      <CustomButton items={items} />
      {loading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="80vh"
        >
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : users.length === 0 ? (
        <Typography>Nenhum usuário encontrado.</Typography>
      ) : (
        <div className="users-list">
          <div className="users-header">
            <div className="user-column">ID</div>
            <div className="user-column">Usuário</div>
            <div className="user-column">Email</div>
            <div className="user-column">Cargo</div>
            <div className="user-column">Setor</div>
            <div className="user-column">Nível</div>
            <div className="user-column">Nome</div>
            <div className="user-column">Sobrenome</div>
            <div className="user-column">Ativo?</div>
          </div>
          {users.map((user) => (
            <div key={user.id}>
              <div className="user-row">
                <div className="user-column">{user.id}</div>
                <div className="user-column">{user.username}</div>
                <div className="user-column">{user.email}</div>
                <div className="user-column">{user.profile.role}</div>
                <div className="user-column">{user.profile.sector}</div>
                <div className="user-column">{user.profile.level}</div>
                <div className="user-column">{user.first_name}</div>
                <div className="user-column">{user.last_name}</div>
                <div className="user-column">
                  <CustomSwitch
                    checked={user.is_active}
                    onChange={() => handleToggleActive(user.id, user.is_active)}
                    color="primary"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <CreateUserModal
        open={openModal}
        onClose={handleCloseModal}
        onUserAdded={handleUserAdded}
      />
    </Box>
  );
};

export default Users;
