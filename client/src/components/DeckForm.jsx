import React, { useState } from 'react';

const DeckForm = ({ onSubmit, errorText, buttonText = 'Create Deck', initialTitle = '' }) => {
  const [title, setTitle] = useState(initialTitle);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(title);
  };

  return (
    <form onSubmit={handleSubmit} className="deck-form" style={{ marginBottom: '1.5rem' }}>
      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter deck title..."
          className="deck-title-input"
          style={{
            padding: '0.5rem 1rem',
            fontSize: '1rem',
            borderRadius: '4px',
            border: '1px solid #ccc',
            flex: '1'
          }}
        />
        <button
          type="submit"
          className="deck-submit-btn"
          style={{
            padding: '0.5rem 1rem',
            fontSize: '1rem',
            backgroundColor: '#3498db',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          {buttonText}
        </button>
      </div>
      {errorText && (
        <div
          className="inline-error-text"
          style={{ color: '#e74c3c', fontSize: '0.9rem', marginTop: '0.5rem', textAlign: 'left' }}
        >
          {errorText}
        </div>
      )}
    </form>
  );
};

export default DeckForm;
