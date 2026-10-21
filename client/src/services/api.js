// client/src/services/api.js - Centralized API service for client-server communication

const API_BASE = `${import.meta.env.VITE_API_URL || ''}/api`;

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

// Missed Words API
export const getMissedWords = async () => {
  const response = await fetch(`${API_BASE}/missed-words`);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const err = new Error(errorData.error || `Failed to fetch missed words`);
    err.status = response.status;
    throw err;
  }
  return response.json();
};

export const addMissedWord = async (wordId) => {
  const response = await fetch(`${API_BASE}/missed-words`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ word_id: wordId }),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const err = new Error(data.error || 'Failed to record missed word');
    err.status = response.status;
    throw err;
  }
  return data;
};

// Auth API
export const getCurrentUser = async () => {
  const response = await fetch(`${API_BASE}/me`);
  if (!response.ok) {
    return null;
  }
  const data = await response.json();
  return data.user || null;
};

export const mockLogin = async (userData = {}) => {
  const response = await fetch(`${API_BASE}/auth/mock-login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const err = new Error(data.error || 'Failed to log in');
    err.status = response.status;
    throw err;
  }
  return data.user;
};

// Scores & Leaderboard API
export const saveScore = async ({ direction, score, similarity_pct }) => {
  const response = await fetch(`${API_BASE}/scores`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ direction, score, similarity_pct }),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const err = new Error(data.error || 'Failed to save score');
    err.status = response.status;
    err.data = data;
    throw err;
  }
  return data;
};

export const getLeaderboard = async (direction = 'cn_to_jp', limit = 10) => {
  const response = await fetch(`${API_BASE}/scores/leaderboard?direction=${direction}&limit=${limit}`);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Failed to fetch leaderboard: ${response.statusText}`);
  }
  return response.json();
};

export const getAllScores = async () => {
  const response = await fetch(`${API_BASE}/scores`);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Failed to fetch scores: ${response.statusText}`);
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
  getMissedWords,
  addMissedWord,
  getCurrentUser,
  mockLogin,
  saveScore,
  getLeaderboard,
  getAllScores,
};
