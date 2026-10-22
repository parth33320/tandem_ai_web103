// Presenter Component - Navigation Bar
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { stopSpeech } from '../utils/voiceHost';

const NavBar = ({ user, loading }) => {
  const [loggingOut, setLoggingOut] = useState(false);
  const [isMuted, setIsMuted] = useState(() => {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem('muted') === 'true';
    }
    return false;
  });

  useEffect(() => {
    if (typeof localStorage !== 'undefined') {
      const storedMuted = localStorage.getItem('muted') === 'true';
      if (storedMuted !== isMuted) {
        setIsMuted(storedMuted);
      }
    }
  }, []);

  const handleLogoutClick = async (e) => {
    e.preventDefault();
    if (loggingOut) return;
    setLoggingOut(true);
    try {
      window.location.href = '/auth/logout';
    } catch (err) {
      console.error('Logout error:', err);
      window.location.href = '/auth/logout';
    }
  };

  const handleMuteToggle = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('muted', nextMuted ? 'true' : 'false');
    }
    if (nextMuted) {
      stopSpeech();
    }
  };

  return (
    <header style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1rem 2rem',
      backgroundColor: '#2c3e50',
      color: '#fff'
    }}>
      <h2 style={{ margin: 0 }}>
        <Link to="/" style={{ color: '#fff', textDecoration: 'none' }}>Tandem</Link>
      </h2>

      <nav style={{ display: 'flex', gap: '1.2rem', alignItems: 'center' }}>
        <Link to="/" style={{ color: '#fff', textDecoration: 'none' }}>Home</Link>
        <Link to="/play" style={{ color: '#fff', textDecoration: 'none' }}>Play</Link>
        <Link to="/leaderboard" style={{ color: '#fff', textDecoration: 'none' }}>Leaderboard</Link>
        <Link to="/decks" style={{ color: '#fff', textDecoration: 'none' }}>Decks</Link>
        <Link to="/profile" style={{ color: '#fff', textDecoration: 'none' }}>Profile</Link>

        <button
          type="button"
          onClick={handleMuteToggle}
          className="mute-btn"
          aria-label={isMuted ? 'Unmute audio' : 'Mute audio'}
          style={{
            backgroundColor: isMuted ? '#7f8c8d' : '#27ae60',
            color: '#fff',
            border: 'none',
            padding: '0.4rem 0.8rem',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '0.85rem',
            fontWeight: 'bold',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.3rem'
          }}
        >
          {isMuted ? '🔇 Muted' : '🔊 Sound On'}
        </button>

        {!loading && (
          <div className="auth-nav-container" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {user ? (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {user.avatar_url ? (
                    <img
                      src={user.avatar_url}
                      alt={user.username}
                      className="user-avatar"
                      style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
                    />
                  ) : (
                    <div
                      className="user-avatar-custom"
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        backgroundColor: user.avatar_bg || '#21253a',
                        color: user.avatar_color || '#6c63ff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 'bold',
                        fontSize: '0.85rem'
                      }}
                    >
                      {(user.username || 'U').slice(0, 2).toUpperCase()}
                    </div>
                  )}
                  <span className="username" style={{ fontWeight: 'bold' }}>{user.username}</span>
                </div>
                <button
                  type="button"
                  onClick={handleLogoutClick}
                  className="logout-btn"
                  style={{
                    color: '#e74c3c',
                    backgroundColor: '#fff',
                    padding: '0.4rem 0.8rem',
                    borderRadius: '4px',
                    border: 'none',
                    fontSize: '0.9rem',
                    fontWeight: 'bold',
                    pointerEvents: loggingOut ? 'none' : 'auto',
                    opacity: loggingOut ? 0.6 : 1,
                    cursor: loggingOut ? 'not-allowed' : 'pointer'
                  }}
                  disabled={loggingOut}
                >
                  {loggingOut ? 'Logging out...' : 'Logout'}
                </button>
              </>
            ) : (
              <a
                href="/auth/github"
                className="login-github-btn"
                style={{
                  backgroundColor: '#24292e',
                  color: '#fff',
                  padding: '0.5rem 1rem',
                  borderRadius: '6px',
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  fontWeight: 'bold',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  border: '1px solid #444'
                }}
              >
                Login with GitHub
              </a>
            )}
          </div>
        )}
      </nav>
    </header>
  );
};

export default NavBar;
