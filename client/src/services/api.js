// client/src/services/api.js - Centralized API service for client-server communication

const API_BASE = '/api';

export const getRandomWord = async (direction = 'cn_to_jp') => {
  const response = await fetch(`${API_BASE}/words/random?direction=${direction}`);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Failed to fetch random word: ${response.statusText}`);
  }
  return response.json();
};

export const getAllWords = async () => {
  const response = await fetch(`${API_BASE}/words`);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Failed to fetch words: ${response.statusText}`);
  }
  return response.json();
};

export const getWordById = async (id) => {
  const response = await fetch(`${API_BASE}/words/${id}`);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Failed to fetch word ${id}: ${response.statusText}`);
  }
  return response.json();
};

export const resetDatabase = async () => {
  const response = await fetch(`${API_BASE}/reset`);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Failed to reset database: ${response.statusText}`);
  }
  return response.json();
};

// Decks API
export const getAllDecks = async () => {
  const response = await fetch(`${API_BASE}/decks`);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Failed to fetch decks: ${response.statusText}`);
  }
  return response.json();
};

export const getDeckById = async (id) => {
  const response = await fetch(`${API_BASE}/decks/${id}`);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Failed to fetch deck ${id}: ${response.statusText}`);
  }
  return response.json();
};

export const createDeck = async (title) => {
  const response = await fetch(`${API_BASE}/decks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title }),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const err = new Error(data.error || 'Failed to create deck');
    err.status = response.status;
    err.data = data;
    throw err;
  }
  return data;
};

export const updateDeck = async (id, title) => {
  const response = await fetch(`${API_BASE}/decks/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title }),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const err = new Error(data.error || 'Failed to update deck');
    err.status = response.status;
    err.data = data;
    throw err;
  }
  return data;
};

export const deleteDeck = async (id) => {
  const response = await fetch(`${API_BASE}/decks/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Failed to delete deck: ${response.statusText}`);
  }
  return response.json();
};

export const addWordToDeck = async (deckId, wordId, position = 0) => {
  const response = await fetch(`${API_BASE}/decks/${deckId}/words`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ word_id: wordId, position }),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const err = new Error(data.error || 'Failed to add word to deck');
    err.status = response.status;
    err.data = data;
    throw err;
  }
  return data;
};

export const removeWordFromDeck = async (deckId, wordId) => {
  const response = await fetch(`${API_BASE}/decks/${deckId}/words/${wordId}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Failed to remove word from deck: ${response.statusText}`);
  }
  return response.json();
};

export default {
  getRandomWord,
  getAllWords,
  getWordById,
  resetDatabase,
  getAllDecks,
  getDeckById,
  createDeck,
  updateDeck,
  deleteDeck,
  addWordToDeck,
  removeWordFromDeck,
};
