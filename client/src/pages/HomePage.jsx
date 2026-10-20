import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="home-page" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#2c3e50' }}>
        Welcome to Tandem!
      </h1>
      <p style={{ fontSize: '1.2rem', color: '#555', maxWidth: '600px', margin: '0 auto 2rem' }}>
        Test your knowledge of Chinese and Japanese shared character pairs.
        Guess meanings, spot false friends, and explore how much the languages overlap!
      </p>
      <button
        onClick={() => navigate('/play')}
        style={{
          padding: '1rem 2.5rem',
          fontSize: '1.25rem',
          fontWeight: 'bold',
          backgroundColor: '#3498db',
          color: '#fff',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}
      >
        Play
      </button>
    </div>
  );
};

export default HomePage;
