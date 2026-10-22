// client/src/components/lifelines/ExpertChart.jsx - Expert Advice Simulator Button
import React, { useState } from 'react';

const ExpertChart = ({ roomId, wordData, onActivate, disabled, used }) => {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (disabled || used || loading || !wordData || !wordData.options) return;

    setLoading(true);
    try {
      if (roomId) {
        const res = await fetch(`/api/rooms/${roomId}/lifelines/use`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ lifelineType: 'Expert_Advice' })
        });
        if (!res.ok) {
          console.error('Failed to use Expert_Advice lifeline');
          setLoading(false);
          return;
        }
      }

      const options = wordData.options;
      const correctAnswer = wordData.correct_answer;
      const correctIndex = options.indexOf(correctAnswer);

      // Assign 65–80% probability weight to the correct answer
      const correctWeight = Math.floor(Math.random() * (80 - 65 + 1)) + 65;
      let remaining = 100 - correctWeight;

      const wrongIndexes = options
        .map((_, idx) => idx)
        .filter(idx => idx !== correctIndex);

      // Distribute remaining weight randomly across the 3 wrong answers
      const w1 = Math.floor(Math.random() * (remaining - 2)) + 1;
      remaining -= w1;
      const w2 = Math.floor(Math.random() * (remaining - 1)) + 1;
      const w3 = remaining - w2;

      const weights = [0, 0, 0, 0];
      weights[correctIndex] = correctWeight;
      weights[wrongIndexes[0]] = w1;
      weights[wrongIndexes[1]] = w2;
      weights[wrongIndexes[2]] = w3;

      // Sort by weight descending so Expert A predicts top recommendation
      const sortedIndexes = [0, 1, 2, 3].sort((a, b) => weights[b] - weights[a]);

      const expertResults = [
        { label: 'A', answer: options[sortedIndexes[0]], percentage: weights[sortedIndexes[0]] },
        { label: 'B', answer: options[sortedIndexes[1]], percentage: weights[sortedIndexes[1]] },
        { label: 'C', answer: options[sortedIndexes[2]], percentage: weights[sortedIndexes[2]] }
      ];

      onActivate(expertResults);
    } catch (err) {
      console.error('Error executing Expert_Advice lifeline:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      className="lifeline-btn expert-chart-btn"
      onClick={handleClick}
      disabled={disabled || used || loading}
      style={{
        padding: '0.5rem 0.75rem',
        backgroundColor: disabled || used ? '#bdc3c7' : '#2ecc71',
        color: '#fff',
        border: 'none',
        borderRadius: '6px',
        fontWeight: 'bold',
        cursor: disabled || used ? 'not-allowed' : 'pointer',
        fontSize: '0.9rem',
        transition: 'all 0.2s'
      }}
    >
      {loading ? '...' : 'Expert 📊'}
    </button>
  );
};

export default ExpertChart;
