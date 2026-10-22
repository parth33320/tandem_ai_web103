// Container Component - 404 Page Not Found
import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div
      className="not-found-container"
      style={{
        padding: '4rem 1rem',
        textAlign: 'center',
        maxWidth: '600px',
        margin: '0 auto'
      }}
    >
      <h1 style={{ fontSize: '4rem', color: '#e74c3c', margin: '0 0 1rem 0' }}>404</h1>
      <h2 style={{ color: '#2c3e50', marginBottom: '1rem' }}>Page Not Found</h2>
      <p style={{ color: '#666', marginBottom: '2rem', lineHeight: '1.6' }}>
        Oops! The page you are looking for does not exist or has been moved.
      </p>
      <Link
        to="/"
        className="home-link-btn"
        style={{
          display: 'inline-block',
          backgroundColor: '#3498db',
          color: '#fff',
          padding: '0.75rem 1.5rem',
          borderRadius: '6px',
          textDecoration: 'none',
          fontWeight: 'bold'
        }}
      >
        Return to Home
      </Link>
    </div>
  );
};

export default NotFoundPage;
