// Container Component
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import DeckList from '../components/DeckList';
import DeckForm from '../components/DeckForm';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  getAllDecks,
  createDeck,
  deleteDeck,
  updateDeck,
  getAllWords,
  addWordToDeck
} from '../services/api';

const DecksPage = ({ user }) => {
  const [decks, setDecks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formError, setFormError] = useState('');
  const [pageError, setPageError] = useState('');
  const navigate = useNavigate();
  const autoSeedingRef = useRef(false);

  const loadDecksAndAutoSeed = async () => {
    try {
      setLoading(true);
      setPageError('');

      // Auto-Generated Data: On first ever app visit (localStorage key tandem_first_visit not set)
      const hasVisited = localStorage.getItem('tandem_first_visit');
      if (!hasVisited && !autoSeedingRef.current) {
        autoSeedingRef.current = true;
        localStorage.setItem('tandem_first_visit', 'true');
        try {
          const starterDeck = await createDeck('Starter Deck');
          const allWords = await getAllWords();
          if (starterDeck && starterDeck.id && Array.isArray(allWords)) {
            const seedWords = allWords.slice(0, 5);
            for (let i = 0; i < seedWords.length; i++) {
              await addWordToDeck(starterDeck.id, seedWords[i].id, i);
            }
          }
        } catch (seedErr) {
          console.error('Auto-seed starter deck error:', seedErr);
        }
      }

      const deckList = await getAllDecks();
      setDecks(deckList);
    } catch (err) {
      console.error('Error loading decks:', err);
      setPageError(err.message || 'Failed to load decks.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDecksAndAutoSeed();
  }, []);

  const handleCreateDeck = async (title) => {
    if (!user) {
      toast.error('Login required');
      setFormError('Login required to create decks.');
      return;
    }

    try {
      setFormError('');
      const newDeck = await createDeck(title);
      toast.success('Deck created successfully');
      navigate(`/decks/${newDeck.id}`);
    } catch (err) {
      console.error('Error creating deck:', err);
      if (err.status === 401) {
        toast.error('Login required');
      } else {
        toast.error(err.message || 'Failed to create deck');
      }
      setFormError(err.message || 'Failed to create deck');
    }
  };

  const handleDeleteDeck = async (deckId) => {
    try {
      setPageError('');
      await deleteDeck(deckId);
      setDecks((prev) => prev.filter((d) => d.id !== deckId));
    } catch (err) {
      console.error('Error deleting deck:', err);
      throw err;
    }
  };

  const handleUpdateDeckTitle = async (deckId, title) => {
    try {
      const updated = await updateDeck(deckId, title);
      setDecks((prev) =>
        prev.map((d) => (d.id === deckId ? { ...d, title: updated.title } : d))
      );
      return updated;
    } catch (err) {
      console.error('Error updating deck title:', err);
      throw err;
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="decks-page-container" style={{ padding: '2rem 1rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '1.5rem', color: '#2c3e50' }}>Custom Decks</h1>

      {pageError && (
        <div
          className="inline-error-text"
          style={{
            padding: '0.8rem 1rem',
            backgroundColor: '#f8d7da',
            color: '#721c24',
            border: '1px solid #f5c6cb',
            borderRadius: '4px',
            marginBottom: '1.5rem',
            textAlign: 'center'
          }}
        >
          {pageError}
        </div>
      )}

      <div style={{ backgroundColor: '#fff', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', marginBottom: '2rem' }}>
        <h3 style={{ margin: '0 0 1rem 0', color: '#34495e' }}>Create New Deck</h3>
        <DeckForm onSubmit={handleCreateDeck} errorText={formError} buttonText="Create Deck" />
      </div>

      <DeckList
        decks={decks}
        onDeleteDeck={handleDeleteDeck}
        onUpdateDeckTitle={handleUpdateDeckTitle}
        user={user}
      />
    </div>
  );
};

export default DecksPage;
