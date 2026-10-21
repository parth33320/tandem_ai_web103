// Presenter Component
import React, { useState } from 'react';

const DeckForm = ({ onSubmit, errorText, buttonText = 'Create Deck', initialTitle = '' }) => {
  const [title, setTitle] = useState(initialTitle);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      await onSubmit(title);
    } finally {
      setIsSubmitting(false);
    }
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
          disabled={isSubmitting}
          className="deck-submit-btn"
          style={{
            padding: '0.5rem 1rem',
            fontSize: '1rem',
            backgroundColor: isSubmitting ? '#aed6f1' : '#3498db',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: isSubmitting ? 'not-allowed' : 'pointer'
          }}
        >
          {isSubmitting ? 'Submitting...' : buttonText}
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
