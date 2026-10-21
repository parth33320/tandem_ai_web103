// Container Component
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';
import { getDeckById, getAllWords, addWordToDeck, removeWordFromDeck } from '../services/api';

const DeckDetailPage = ({ user }) => {
  const { id } = useParams();
  const [deck, setDeck] = useState(null);
  const [allWords, setAllWords] = useState([]);
  const [selectedWordId, setSelectedWordId] = useState('');
  const [loading, setLoading] = useState(true);
  const [errorText, setErrorText] = useState('');
  const [addingWord, setAddingWord] = useState(false);
  const [removingWordId, setRemovingWordId] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setErrorText('');
      const [deckData, wordsData] = await Promise.all([
        getDeckById(id),
        getAllWords()
      ]);
      setDeck(deckData);
      setAllWords(wordsData);
    } catch (err) {
      console.error('Error loading deck details:', err);
      setErrorText(err.message || 'Failed to load deck details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const handleAddWord = async (e) => {
    e.preventDefault();
    if (!selectedWordId) return;

    if (!user) {
      toast.error('Login required');
      setErrorText('Login required');
      return;
    }

    try {
      setAddingWord(true);
      setErrorText('');
      await addWordToDeck(id, parseInt(selectedWordId, 10), deck.words ? deck.words.length : 0);
      toast.success('Word added to deck');
      setSelectedWordId('');
      const updatedDeck = await getDeckById(id);
      setDeck(updatedDeck);
    } catch (err) {
      console.error('Error adding word to deck:', err);
      if (err.status === 401) {
        toast.error('Login required');
      } else {
        toast.error(err.message || 'Failed to add word to deck');
      }
      setErrorText(err.message || 'Failed to add word to deck');
    } finally {
      setAddingWord(false);
    }
  };

  const handleRemoveWord = async (wordId) => {
    if (!user) {
      toast.error('Login required');
      setErrorText('Login required');
      return;
    }

    try {
      setRemovingWordId(wordId);
      setErrorText('');
      await removeWordFromDeck(id, wordId);
      toast.success('Word removed from deck');
      setDeck((prev) => ({
        ...prev,
        words: prev.words.filter((w) => w.id !== wordId)
      }));
    } catch (err) {
      console.error('Error removing word from deck:', err);
      if (err.status === 401) {
        toast.error('Login required');
      } else {
        toast.error(err.message || 'Failed to remove word from deck');
      }
      setErrorText(err.message || 'Failed to remove word from deck');
    } finally {
      setRemovingWordId(null);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (errorText && !deck) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <div className="inline-error-text" style={{ color: '#e74c3c', marginBottom: '1rem' }}>
          {errorText}
        </div>
        <Link to="/decks" style={{ color: '#3498db', textDecoration: 'none' }}>&larr; Back to Decks</Link>
      </div>
    );
  }

  const existingWordIds = new Set((deck?.words || []).map((w) => w.id));
  const availableWords = allWords.filter((w) => !existingWordIds.has(w.id));

  return (
    <div className="deck-detail-container" style={{ padding: '2rem 1rem', maxWidth: '800px', margin: '0 auto' }}>
      <Link to="/decks" style={{ color: '#3498db', textDecoration: 'none', display: 'inline-block', marginBottom: '1rem' }}>
        &larr; Back to Decks
      </Link>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 className="deck-title" style={{ margin: 0, color: '#2c3e50' }}>{deck?.title}</h1>
        <span style={{ color: '#7f8c8d', fontSize: '0.9rem' }}>
          {deck?.words?.length || 0} word(s)
        </span>
      </div>

      {errorText && (
        <div className="inline-error-text" style={{ color: '#e74c3c', marginBottom: '1rem', padding: '0.5rem', border: '1px solid #f5c6cb', backgroundColor: '#f8d7da', borderRadius: '4px' }}>
          {errorText}
        </div>
      )}

      {/* Add Word Form */}
      <div style={{ backgroundColor: '#fff', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', marginBottom: '2rem' }}>
        <h3 style={{ margin: '0 0 1rem 0', color: '#34495e' }}>Add Word to Deck</h3>
        <form onSubmit={handleAddWord} style={{ display: 'flex', gap: '0.5rem' }}>
          <select
            value={selectedWordId}
            onChange={(e) => setSelectedWordId(e.target.value)}
            disabled={addingWord}
            className="word-select-dropdown"
            style={{
              padding: '0.5rem 1rem',
              fontSize: '1rem',
              borderRadius: '4px',
              border: '1px solid #ccc',
              flex: '1'
            }}
          >
            <option value="">-- Select a word --</option>
            {availableWords.map((word) => (
              <option key={word.id} value={word.id}>
                {word.characters} ({word.chinese_meaning} / {word.japanese_meaning})
              </option>
            ))}
          </select>
          <button
            type="submit"
            disabled={!selectedWordId || addingWord}
            className="add-word-btn"
            style={{
              padding: '0.5rem 1rem',
              fontSize: '1rem',
              backgroundColor: (selectedWordId && !addingWord) ? '#2ecc71' : '#95a5a6',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: (selectedWordId && !addingWord) ? 'pointer' : 'not-allowed'
            }}
          >
            {addingWord ? 'Adding...' : 'Add Word'}
          </button>
        </form>
      </div>

      {/* Words Table */}
      <h3 style={{ color: '#34495e', marginBottom: '1rem' }}>Words in Deck</h3>
      {(!deck?.words || deck.words.length === 0) ? (
        <div className="no-words-msg" style={{ color: '#666', fontStyle: 'italic' }}>
          No words in this deck yet. Select a word above to add it!
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table className="deck-words-table" style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#fff', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
            <thead>
              <tr style={{ backgroundColor: '#f4f6f7', borderBottom: '2px solid #ddd', textAlign: 'left' }}>
                <th style={{ padding: '0.75rem 1rem' }}>Characters</th>
                <th style={{ padding: '0.75rem 1rem' }}>CN Reading / Meaning</th>
                <th style={{ padding: '0.75rem 1rem' }}>JP Reading / Meaning</th>
                <th style={{ padding: '0.75rem 1rem' }}>Tag</th>
                <th style={{ padding: '0.75rem 1rem' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {deck.words.map((word) => (
                <tr key={word.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '0.75rem 1rem', fontWeight: 'bold' }}>{word.characters}</td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    {word.chinese_reading} ({word.chinese_meaning})
                  </td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    {word.japanese_reading} ({word.japanese_meaning})
                  </td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <span className={`relationship-tag ${word.relationship_tag}`} style={{ fontSize: '0.85rem' }}>
                      {word.relationship_tag}
                    </span>
                  </td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <button
                      onClick={() => handleRemoveWord(word.id)}
                      disabled={removingWordId === word.id}
                      className="remove-word-btn"
                      style={{
                        padding: '0.3rem 0.6rem',
                        backgroundColor: removingWordId === word.id ? '#f5b7b1' : '#e74c3c',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: removingWordId === word.id ? 'not-allowed' : 'pointer',
                        fontSize: '0.85rem'
                      }}
                    >
                      {removingWordId === word.id ? 'Removing...' : 'Remove'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DeckDetailPage;
