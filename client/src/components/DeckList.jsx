// Presenter Component
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const DeckList = ({ decks, onDeleteDeck, onUpdateDeckTitle, user }) => {
  const [editingDeckId, setEditingDeckId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editError, setEditError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingDeckId, setDeletingDeckId] = useState(null);

  const handleStartEdit = (deck) => {
    if (!user) {
      toast.error('Login required');
      return;
    }
    setEditingDeckId(deck.id);
    setEditTitle(deck.title);
    setEditError('');
  };

  const handleSaveEdit = async (deckId) => {
    if (!user) {
      toast.error('Login required');
      return;
    }
    try {
      setEditError('');
      setIsSubmitting(true);
      await onUpdateDeckTitle(deckId, editTitle);
      toast.success('Deck update saved');
      setEditingDeckId(null);
    } catch (err) {
      if (err.status === 401) {
        toast.error('Login required');
      } else {
        toast.error(err.message || 'Failed to update title');
      }
      setEditError(err.message || 'Failed to update title');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (deckId) => {
    if (!user) {
      toast.error('Login required');
      return;
    }
    try {
      setDeletingDeckId(deckId);
      await onDeleteDeck(deckId);
      toast.success('Deck deleted');
    } catch (err) {
      if (err.status === 401) {
        toast.error('Login required');
      } else {
        toast.error(err.message || 'Failed to delete deck');
      }
    } finally {
      setDeletingDeckId(null);
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
                disabled={isSubmitting}
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
                  disabled={isSubmitting}
                  className="save-title-btn"
                  style={{ padding: '0.3rem 0.6rem', backgroundColor: isSubmitting ? '#a5d6a7' : '#2ecc71', color: '#fff', border: 'none', borderRadius: '4px', cursor: isSubmitting ? 'not-allowed' : 'pointer' }}
                >
                  {isSubmitting ? 'Saving...' : 'Save'}
                </button>
                <button
                  onClick={handleCancelEdit}
                  disabled={isSubmitting}
                  className="cancel-title-btn"
                  style={{ padding: '0.3rem 0.6rem', backgroundColor: '#95a5a6', color: '#fff', border: 'none', borderRadius: '4px', cursor: isSubmitting ? 'not-allowed' : 'pointer' }}
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
                disabled={deletingDeckId === deck.id}
                className="edit-deck-btn"
                style={{
                  padding: '0.4rem 0.8rem',
                  backgroundColor: '#f39c12',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: deletingDeckId === deck.id ? 'not-allowed' : 'pointer',
                  fontSize: '0.9rem'
                }}
              >
                Rename
              </button>
              <button
                onClick={() => handleDelete(deck.id)}
                disabled={deletingDeckId === deck.id}
                className="delete-deck-btn"
                style={{
                  padding: '0.4rem 0.8rem',
                  backgroundColor: deletingDeckId === deck.id ? '#f5b7b1' : '#e74c3c',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: deletingDeckId === deck.id ? 'not-allowed' : 'pointer',
                  fontSize: '0.9rem'
                }}
              >
                {deletingDeckId === deck.id ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default DeckList;
