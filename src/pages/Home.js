// src/pages/Home.js
import React from 'react';
import useFetch from '../hooks/useFetch';

const Home = () => {
  const { data, loading, error } = useFetch('https://api.example.com/data');

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h1>Home Page</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};

export default Home;
