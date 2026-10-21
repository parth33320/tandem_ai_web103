// Container Component
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../services/api';

const HomePage = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [guestRounds, setGuestRounds] = useState(0);
  const [loadingAuth, setLoadingAuth] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const checkAuthAndRounds = async () => {
      try {
        const user = await getCurrentUser();
        if (isMounted) {
          setIsLoggedIn(!!user);
        }
      } catch (err) {
        if (isMounted) {
          setIsLoggedIn(false);
        }
      } finally {
        if (isMounted) {
          const storedRounds = parseInt(localStorage.getItem('tandem_guest_rounds') || '0', 10);
          setGuestRounds(isNaN(storedRounds) ? 0 : storedRounds);
          setLoadingAuth(false);
        }
      }
    };

    checkAuthAndRounds();

    return () => {
      isMounted = false;
    };
  }, []);

  const isGuestRestricted = !isLoggedIn && guestRounds >= 3;

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
        className="play-button"
        disabled={isGuestRestricted}
        onClick={() => {
          if (!isGuestRestricted) {
            navigate('/play');
          }
        }}
        style={{
          padding: '1rem 2.5rem',
          fontSize: '1.25rem',
          fontWeight: 'bold',
          backgroundColor: isGuestRestricted ? '#95a5a6' : '#3498db',
          color: '#fff',
          border: 'none',
          borderRadius: '8px',
          cursor: isGuestRestricted ? 'not-allowed' : 'pointer',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          opacity: isGuestRestricted ? 0.6 : 1
        }}
      >
        Play
      </button>

      {isGuestRestricted && (
        <p
          className="login-prompt"
          style={{
            color: '#e74c3c',
            marginTop: '1.5rem',
            fontSize: '1.1rem',
            fontWeight: 'bold'
          }}
        >
          You've played 3 free rounds. Log in to keep playing.
        </p>
      )}
    </div>
  );
};

export default HomePage;
