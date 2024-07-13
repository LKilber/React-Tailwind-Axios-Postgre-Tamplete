// src/components/UserProfile.js
import React from 'react';
import { formatDate } from '../utils/dataFormatters';
import { isEmailValid } from '../utils/validators';

const UserProfile = ({ user }) => {
  return (
    <div className="user-profile">
      <h2>{user.name}</h2>
      <p>Email: {user.email}</p>
      <p>Joined: {formatDate(user.joined)}</p>
      <p>Email is {isEmailValid(user.email) ? 'valid' : 'invalid'}</p>
    </div>
  );
};

export default UserProfile;
