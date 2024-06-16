// src/pages/Profile.js
import React from 'react';
import useAuth from '../hooks/useAuth';

const Profile = () => {
  const { user, loading } = useAuth();

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1>Profile Page</h1>
      {user ? <p>Welcome, {user.name}</p> : <p>You are not logged in.</p>}
    </div>
  );
};

export default Profile;
