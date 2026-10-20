import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="spinner-container" style={{ textAlign: 'center', padding: '2rem' }}>
      <div className="spinner" style={{
        display: 'inline-block',
        width: '40px',
        height: '40px',
        border: '4px solid rgba(0, 0, 0, 0.1)',
        borderRadius: '50%',
        borderTopColor: '#3498db',
        animation: 'spin 1s ease-in-out infinite'
      }}></div>
      <p style={{ marginTop: '1rem', color: '#555' }}>Loading question...</p>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default LoadingSpinner;
