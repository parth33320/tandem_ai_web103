// client/src/services/api.js - Centralized API service for client-server communication

const API_BASE = '/api';

export const getRandomWord = async (direction = 'cn_to_jp') => {
  const response = await fetch(`${API_BASE}/words/random?direction=${direction}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch random word: ${response.statusText}`);
  }
  return response.json();
};

export const getAllWords = async () => {
  const response = await fetch(`${API_BASE}/words`);
  if (!response.ok) {
    throw new Error(`Failed to fetch words: ${response.statusText}`);
  }
  return response.json();
};

export const getWordById = async (id) => {
  const response = await fetch(`${API_BASE}/words/${id}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch word ${id}: ${response.statusText}`);
  }
  return response.json();
};

export const resetDatabase = async () => {
  const response = await fetch(`${API_BASE}/reset`);
  if (!response.ok) {
    throw new Error(`Failed to reset database: ${response.statusText}`);
  }
  return response.json();
};

export default {
  getRandomWord,
  getAllWords,
  getWordById,
  resetDatabase,
};
