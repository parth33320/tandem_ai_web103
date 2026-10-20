import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const DeckList = ({ decks, onDeleteDeck, onUpdateDeckTitle }) => {
  const [editingDeckId, setEditingDeckId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editError, setEditError] = useState('');

  const handleStartEdit = (deck) => {
    setEditingDeckId(deck.id);
    setEditTitle(deck.title);
    setEditError('');
  };

  const handleSaveEdit = async (deckId) => {
    try {
      setEditError('');
      await onUpdateDeckTitle(deckId, editTitle);
      setEditingDeckId(null);
    } catch (err) {
      setEditError(err.message || 'Failed to update title');
    }
  };

  const handleCancelEdit = () => {
    setEditingDeckId(null);
    setEditTitle('');
    setEditError('');
  };

  if (!decks || decks.length === 0) {
    return (
      <div className="no-decks-msg" style={{ marginTop: '2rem', color: '#666' }}>
        No decks found. Create one above!
      </div>
    );
  }

  return (
    <div className="deck-list" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem', marginTop: '1.5rem' }}>
      {decks.map((deck) => (
        <div
          key={deck.id}
          className="deck-card"
          style={{
            border: '1px solid #ddd',
            borderRadius: '8px',
            padding: '1.2rem',
            backgroundColor: '#fff',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
            display: 'flex',
            flexDirection: 'column',
            justify: 'space-between'
          }}
        >
          {editingDeckId === deck.id ? (
            <div>
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="edit-deck-title-input"
                style={{
                  width: '100%',
                  padding: '0.4rem',
                  fontSize: '1rem',
                  marginBottom: '0.5rem',
                  borderRadius: '4px',
                  border: '1px solid #ccc'
                }}
              />
              {editError && (
                <div className="inline-error-text" style={{ color: '#e74c3c', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                  {editError}
                </div>
              )}
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={() => handleSaveEdit(deck.id)}
                  className="save-title-btn"
                  style={{ padding: '0.3rem 0.6rem', backgroundColor: '#2ecc71', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                  Save
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="cancel-title-btn"
                  style={{ padding: '0.3rem 0.6rem', backgroundColor: '#95a5a6', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div>
              <h3 className="deck-card-title" style={{ margin: '0 0 0.5rem 0', fontSize: '1.2rem' }}>
                <Link to={`/decks/${deck.id}`} style={{ color: '#2c3e50', textDecoration: 'none' }}>
                  {deck.title}
                </Link>
              </h3>
              <p style={{ color: '#7f8c8d', fontSize: '0.85rem', margin: '0 0 1rem 0' }}>
                Created: {new Date(deck.created_at).toLocaleDateString()}
              </p>
            </div>
          )}

          {editingDeckId !== deck.id && (
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
              <Link
                to={`/decks/${deck.id}`}
                className="view-deck-btn"
                style={{
                  padding: '0.4rem 0.8rem',
                  backgroundColor: '#3498db',
                  color: '#fff',
                  borderRadius: '4px',
                  textDecoration: 'none',
                  fontSize: '0.9rem'
                }}
              >
                View / Edit Words
              </Link>
              <button
                onClick={() => handleStartEdit(deck)}
                className="edit-deck-btn"
                style={{
                  padding: '0.4rem 0.8rem',
                  backgroundColor: '#f39c12',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '0.9rem'
                }}
              >
                Rename
              </button>
              <button
                onClick={() => onDeleteDeck(deck.id)}
                className="delete-deck-btn"
                style={{
                  padding: '0.4rem 0.8rem',
                  backgroundColor: '#e74c3c',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '0.9rem'
                }}
              >
                Delete
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default DeckList;
