// server/controllers/decksController.js - Decks controller logic
import pool from '../config/db.js';

// GET /api/decks — list all decks
export const getAllDecks = async (req, res, next) => {
  try {
    const result = await pool.query('SELECT * FROM decks ORDER BY id ASC');
    res.status(200).json(result.rows);
  } catch (error) {
    next(error);
  }
};

// GET /api/decks/:id — single deck with its words (join query on deck_words)
export const getDeckById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deckRes = await pool.query('SELECT * FROM decks WHERE id = $1', [id]);
    if (deckRes.rows.length === 0) {
      return res.status(404).json({ error: 'Deck not found', code: 'NOT_FOUND' });
    }

    const wordsRes = await pool.query(
      `SELECT w.*, dw.position
       FROM deck_words dw
       JOIN words w ON dw.word_id = w.id
       WHERE dw.deck_id = $1
       ORDER BY dw.position ASC, dw.id ASC`,
      [id]
    );

    res.status(200).json({
      ...deckRes.rows[0],
      words: wordsRes.rows
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/decks — create deck
export const createDeck = async (req, res, next) => {
  try {
    const { title } = req.body;
    if (!title || typeof title !== 'string' || title.trim() === '' || title.trim().length > 80) {
      return res.status(400).json({ error: 'Title is required and must be under 80 characters.', code: 'INVALID_INPUT' });
    }

    const result = await pool.query(
      'INSERT INTO decks (title) VALUES ($1) RETURNING *',
      [title.trim()]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

// PATCH /api/decks/:id — update title
export const updateDeck = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title } = req.body;

    if (!title || typeof title !== 'string' || title.trim() === '' || title.trim().length > 80) {
      return res.status(400).json({ error: 'Title is required and must be under 80 characters.', code: 'INVALID_INPUT' });
    }

    const result = await pool.query(
      'UPDATE decks SET title = $1 WHERE id = $2 RETURNING *',
      [title.trim(), id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Deck not found', code: 'NOT_FOUND' });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

// DELETE /api/decks/:id — delete deck (cascades to deck_words via FK)
export const deleteDeck = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM decks WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Deck not found', code: 'NOT_FOUND' });
    }

    res.status(200).json({ message: 'Deck deleted successfully', deck: result.rows[0] });
  } catch (error) {
    next(error);
  }
};

// POST /api/decks/:id/words — add word to deck
export const addWordToDeck = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { word_id, position } = req.body;

    if (!word_id) {
      return res.status(400).json({ error: 'word_id is required', code: 'INVALID_INPUT' });
    }

    const deckRes = await pool.query('SELECT * FROM decks WHERE id = $1', [id]);
    if (deckRes.rows.length === 0) {
      return res.status(404).json({ error: 'Deck not found', code: 'NOT_FOUND' });
    }

    const wordRes = await pool.query('SELECT * FROM words WHERE id = $1', [word_id]);
    if (wordRes.rows.length === 0) {
      return res.status(400).json({ error: 'Word not found in database', code: 'WORD_NOT_FOUND' });
    }

    const pos = typeof position === 'number' ? position : 0;

    const result = await pool.query(
      `INSERT INTO deck_words (deck_id, word_id, position)
       VALUES ($1, $2, $3)
       ON CONFLICT (deck_id, word_id) DO UPDATE SET position = EXCLUDED.position
       RETURNING *`,
      [id, word_id, pos]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

// DELETE /api/decks/:id/words/:word_id — remove word from deck
export const removeWordFromDeck = async (req, res, next) => {
  try {
    const { id, word_id } = req.params;
    const result = await pool.query(
      'DELETE FROM deck_words WHERE deck_id = $1 AND word_id = $2 RETURNING *',
      [id, word_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Word not found in deck', code: 'NOT_FOUND' });
    }

    res.status(200).json({ message: 'Word removed from deck', deleted: result.rows[0] });
  } catch (error) {
    next(error);
  }
};
