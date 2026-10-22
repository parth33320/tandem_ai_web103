// client/src/components/lifelines/FiftyFiftyBtn.jsx - 50:50 Choice Eliminator Button
import React, { useState } from 'react';
import { play as playSound } from '../../utils/sounds';

const FiftyFiftyBtn = ({ roomId, wordData, onActivate, disabled, used }) => {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (disabled || used || loading || !wordData || !wordData.options) return;

    setLoading(true);
    try {
      if (roomId) {
        const res = await fetch(`/api/rooms/${roomId}/lifelines/use`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ lifelineType: 'Fifty_Fifty' })
        });
        if (!res.ok) {
          console.error('Failed to use Fifty_Fifty lifeline');
          setLoading(false);
          return;
        }
      }

      // Calculate 2 wrong answer indexes at random
      const correctOption = wordData.correct_answer;
      const wrongIndexes = wordData.options
        .map((opt, idx) => (opt !== correctOption ? idx : -1))
        .filter(idx => idx !== -1);

      // Randomly pick 2 wrong indexes to hide
      const shuffledWrong = wrongIndexes.sort(() => Math.random() - 0.5);
      const hiddenIndexes = shuffledWrong.slice(0, 2);

      playSound('lifeline');
      onActivate(hiddenIndexes);
    } catch (err) {
      console.error('Error executing 50:50 lifeline:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      className="lifeline-btn fifty-fifty-btn"
      onClick={handleClick}
      disabled={disabled || used || loading}
      style={{
        padding: '0.5rem 0.75rem',
        backgroundColor: disabled || used ? '#bdc3c7' : '#9b59b6',
        color: '#fff',
        border: 'none',
        borderRadius: '6px',
        fontWeight: 'bold',
        cursor: disabled || used ? 'not-allowed' : 'pointer',
        fontSize: '0.9rem',
        transition: 'all 0.2s'
      }}
    >
      {loading ? '...' : '50:50'}
    </button>
  );
};

export default FiftyFiftyBtn;
