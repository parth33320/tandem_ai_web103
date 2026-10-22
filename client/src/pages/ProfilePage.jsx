// Container Component - User Profile & Missed Words
import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { getMissedWords, updateAvatar } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const ProfilePage = ({ user }) => {
  const [missedWords, setMissedWords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [avatarColor, setAvatarColor] = useState(user?.avatar_color || '#6c63ff');
  const [avatarBg, setAvatarBg] = useState(user?.avatar_bg || '#21253a');
  const [savingAvatar, setSavingAvatar] = useState(false);

  useEffect(() => {
    let isMounted = true;

    if (user) {
      if (user.avatar_color) setAvatarColor(user.avatar_color);
      if (user.avatar_bg) setAvatarBg(user.avatar_bg);
    }

    const fetchProfileData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError('');
        const data = await getMissedWords();
        if (isMounted) {
          setMissedWords(data || []);
        }
      } catch (err) {
        console.error('Error loading missed words:', err);
        if (isMounted) {
          setError(err.message || 'Failed to load missed words');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchProfileData();

    return () => {
      isMounted = false;
    };
  }, [user]);

  const handleSaveAvatar = async (e) => {
    e.preventDefault();
    setSavingAvatar(true);
    try {
      await updateAvatar({ avatar_color: avatarColor, avatar_bg: avatarBg });
      toast.success('Avatar updated successfully');
      if (user) {
        user.avatar_color = avatarColor;
        user.avatar_bg = avatarBg;
      }
    } catch (err) {
      console.error('Error saving avatar:', err);
      toast.error(err.message || 'Failed to update avatar');
    } finally {
      setSavingAvatar(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return (
      <div style={{ padding: '3rem 1rem', textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
        <h2>User Profile</h2>
        <p style={{ color: '#666', marginBottom: '1.5rem' }}>
          Please log in to view your profile, customize your avatar, and track missed words.
        </p>
        <a
          href="/auth/github"
          style={{
            display: 'inline-block',
            backgroundColor: '#24292e',
            color: '#fff',
            padding: '0.75rem 1.5rem',
            borderRadius: '6px',
            textDecoration: 'none',
            fontWeight: 'bold'
          }}
        >
          Login with GitHub
        </a>
      </div>
    );
  }

  return (
    <div className="profile-page-container" style={{ padding: '2rem 1rem', maxWidth: '800px', margin: '0 auto' }}>
      {/* Profile Info Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1.5rem',
        backgroundColor: '#fff',
        padding: '1.5rem',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
        marginBottom: '2rem'
      }}>
        {user.avatar_url ? (
          <img
            src={user.avatar_url}
            alt={user.username}
            style={{ width: '64px', height: '64px', borderRadius: '50%' }}
          />
        ) : (
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: avatarBg,
              color: avatarColor,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              fontSize: '1.5rem'
            }}
          >
            {(user.username || 'U').slice(0, 2).toUpperCase()}
          </div>
        )}
        <div>
          <h2 style={{ margin: 0, color: '#2c3e50' }}>{user.username}</h2>
          <p style={{ margin: '0.25rem 0 0 0', color: '#7f8c8d', fontSize: '0.9rem' }}>GitHub User</p>
        </div>
      </div>

      {/* Avatar Customization Section */}
      <div style={{
        backgroundColor: '#fff',
        padding: '1.5rem',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
        marginBottom: '2rem',
        textAlign: 'center'
      }}>
        <h3 style={{ margin: '0 0 1.2rem 0', color: '#2c3e50' }}>Avatar Customization 🎨</h3>

        <div
          className="avatar-preview"
          style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            backgroundColor: avatarBg,
            color: avatarColor,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2rem',
            fontWeight: 'bold',
            boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
            margin: '0 auto 1.5rem auto'
          }}
        >
          {(user.username || 'U').slice(0, 2).toUpperCase()}
        </div>

        <form onSubmit={handleSaveAvatar}>
          <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', marginBottom: '1.5rem' }}>
            <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', fontWeight: 'bold', color: '#34495e' }}>
              Text Color
              <input
                type="color"
                value={avatarColor}
                onChange={(e) => setAvatarColor(e.target.value)}
                className="avatar-color-input"
                style={{ cursor: 'pointer', width: '45px', height: '45px', border: 'none', borderRadius: '4px' }}
              />
            </label>
            <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', fontWeight: 'bold', color: '#34495e' }}>
              Background Color
              <input
                type="color"
                value={avatarBg}
                onChange={(e) => setAvatarBg(e.target.value)}
                className="avatar-bg-input"
                style={{ cursor: 'pointer', width: '45px', height: '45px', border: 'none', borderRadius: '4px' }}
              />
            </label>
          </div>

          <button
            type="submit"
            disabled={savingAvatar}
            className="save-avatar-btn"
            style={{
              backgroundColor: savingAvatar ? '#95a5a6' : '#2ecc71',
              color: '#fff',
              border: 'none',
              padding: '0.6rem 1.5rem',
              borderRadius: '6px',
              fontSize: '1rem',
              fontWeight: 'bold',
              cursor: savingAvatar ? 'not-allowed' : 'pointer'
            }}
          >
            {savingAvatar ? 'Saving...' : 'Save Avatar Colors'}
          </button>
        </form>
      </div>

      {/* Missed Words Tracker Section */}
      <h3 style={{ color: '#2c3e50', marginBottom: '1rem' }}>Missed Words Tracker</h3>

      {error && (
        <div style={{ color: '#dc3545', padding: '1rem', backgroundColor: '#f8d7da', borderRadius: '6px', marginBottom: '1rem' }}>
          {error}
        </div>
      )}

      {missedWords.length === 0 ? (
        <div style={{ backgroundColor: '#fff', padding: '2rem', borderRadius: '8px', textAlign: 'center', color: '#666' }}>
          No missed words recorded yet! Play a round to start tracking words you'd like to practice.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {missedWords.map((item) => (
            <div
              key={item.id || item.word_id}
              className="missed-word-card"
              style={{
                backgroundColor: '#fff',
                padding: '1.2rem',
                borderRadius: '8px',
                border: '1px solid #e0e0e0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
              }}
            >
              <div>
                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1.3rem', color: '#2c3e50' }}>
                  {item.characters}
                </h4>
                <div style={{ fontSize: '0.9rem', color: '#555' }}>
                  <div><strong>CN:</strong> {item.chinese_reading} — {item.chinese_meaning}</div>
                  <div><strong>JP:</strong> {item.japanese_reading} — {item.japanese_meaning}</div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
                <span
                  className="miss-count-badge"
                  style={{
                    backgroundColor: '#dc3545',
                    color: '#fff',
                    padding: '0.3rem 0.8rem',
                    borderRadius: '20px',
                    fontWeight: 'bold',
                    fontSize: '0.85rem'
                  }}
                >
                  Missed {item.miss_count} {item.miss_count === 1 ? 'time' : 'times'}
                </span>
                <span className={`relationship-tag ${item.relationship_tag}`} style={{ fontSize: '0.8rem' }}>
                  {item.relationship_tag}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
