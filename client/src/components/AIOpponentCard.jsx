// client/src/components/AIOpponentCard.jsx - Small card display for Tandem Bot AI Opponent
import React from 'react';

const AIOpponentCard = ({ score = 0, status = 'Ready' }) => {
  return (
    <div className="ai-opponent-card" style={{
      border: '1px solid #9b59b6',
      borderRadius: '8px',
      padding: '0.75rem 1rem',
      backgroundColor: '#fbf4ff',
      textAlign: 'center',
      minWidth: '180px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
    }}>
      <div style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>🤖</div>
      <h4 style={{ margin: '0 0 0.25rem 0', color: '#8e44ad', fontSize: '1rem' }}>
        Tandem Bot
      </h4>
      <div style={{ fontWeight: 'bold', fontSize: '1.1rem', color: '#2c3e50' }}>
        Score: {score}
      </div>
      <div style={{ fontSize: '0.8rem', color: '#7f8c8d', marginTop: '0.25rem' }}>
        {status}
      </div>
    </div>
  );
};

export default AIOpponentCard;
