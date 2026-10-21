// server/routes/decks.js - Express router for Decks API
import express from 'express';
import {
  getAllDecks,
  getDeckById,
  createDeck,
  updateDeck,
  deleteDeck,
  addWordToDeck,
  removeWordFromDeck
} from '../controllers/decksController.js';
import requireAuth from '../middleware/requireAuth.js';

const router = express.Router();

router.get('/', getAllDecks);
router.get('/:id', getDeckById);
router.post('/', requireAuth, createDeck);
router.patch('/:id', requireAuth, updateDeck);
router.delete('/:id', requireAuth, deleteDeck);

router.post('/:id/words', requireAuth, addWordToDeck);
router.delete('/:id/words/:word_id', requireAuth, removeWordFromDeck);

export default router;
