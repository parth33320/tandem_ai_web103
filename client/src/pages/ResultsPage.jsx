import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getCurrentUser, saveScore } from '../services/api';

const ResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state || {};
  const roundWords = state.roundWords || [];
  const score = state.score !== undefined ? state.score : 0;
  const direction = state.direction || 'cn_to_jp';

  const [toastMessage, setToastMessage] = useState(null);
  const [toastType, setToastType] = useState('success');

  const totalQuestions = 10;
  const trueCount = roundWords.filter(w => w.relationship_tag === 'true_friend').length;
  const similarityPct = Math.round((trueCount / totalQuestions) * 100);
  const scorePct = Math.round((score / totalQuestions) * 100);

  useEffect(() => {
    let isMounted = true;

    const handleRoundCompletion = async () => {
      try {
        const user = await getCurrentUser();
        if (user) {
          // User is authenticated - save score to leaderboard
          await saveScore({
            direction,
            score: scorePct,
            similarity_pct: similarityPct
          });
          if (isMounted) {
            setToastMessage('Score saved to leaderboard!');
            setToastType('success');
          }
        } else {
          // Guest user - increment guest rounds count
          const currentRounds = parseInt(localStorage.getItem('tandem_guest_rounds') || '0', 10);
          localStorage.setItem('tandem_guest_rounds', (isNaN(currentRounds) ? 0 : currentRounds) + 1);
        }
      } catch (err) {
        console.error('Error handling round score:', err);
        if (isMounted) {
          setToastMessage('Failed to save score to leaderboard.');
          setToastType('error');
        }
      }
    };

    handleRoundCompletion();

    return () => {
      isMounted = false;
    };
  }, [direction, scorePct, similarityPct]);

  return (
    <div className="results-page" style={{ padding: '2rem', textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
      {toastMessage && (
        <div
          className={`toast-notification ${toastType}`}
          style={{
            padding: '1rem',
            marginBottom: '1.5rem',
            borderRadius: '6px',
            backgroundColor: toastType === 'success' ? '#d4edda' : '#f8d7da',
            color: toastType === 'success' ? '#155724' : '#721c24',
            border: `1px solid ${toastType === 'success' ? '#c3e6cb' : '#f5c6cb'}`,
            fontWeight: 'bold',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}
        >
          {toastMessage}
        </div>
      )}

      <h1 style={{ color: '#2c3e50', marginBottom: '1.5rem' }}>Round Complete!</h1>

      <div style={{
        backgroundColor: '#fff',
        borderRadius: '8px',
        padding: '2rem',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        marginBottom: '2rem'
      }}>
        <h2 style={{ marginBottom: '1rem' }}>Final Score</h2>
        <div className="score-display" style={{ fontSize: '2rem', fontWeight: 'bold', color: '#28a745', marginBottom: '1.5rem' }}>
          {score} / {totalQuestions} ({scorePct}%)
        </div>

        <h3 style={{ marginBottom: '0.5rem' }}>Similarity Meter: {similarityPct}%</h3>
        <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '1rem' }}>
          Percentage of True Friends encountered in this round
        </p>

        <div style={{
          width: '100%',
          backgroundColor: '#e9ecef',
          borderRadius: '12px',
          overflow: 'hidden',
          height: '24px',
          marginBottom: '1rem'
        }}>
          <div
            className="similarity-meter"
            style={{
              width: `${(trueCount / totalQuestions) * 100}%`,
              minWidth: '4px',
              backgroundColor: '#3498db',
              height: '100%',
              borderRadius: '12px',
              transition: 'width 0.5s ease-in-out'
            }}
          />
        </div>
      </div>

      <button
        className="play-again-button"
        onClick={() => navigate('/play')}
        style={{
          padding: '0.75rem 2rem',
          fontSize: '1.1rem',
          fontWeight: 'bold',
          backgroundColor: '#28a745',
          color: '#fff',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer'
        }}
      >
        Play Again
      </button>
    </div>
  );
};

export default ResultsPage;
