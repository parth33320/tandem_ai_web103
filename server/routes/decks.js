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

const router = express.Router();

router.get('/', getAllDecks);
router.get('/:id', getDeckById);
router.post('/', createDeck);
router.patch('/:id', updateDeck);
router.delete('/:id', deleteDeck);

router.post('/:id/words', addWordToDeck);
router.delete('/:id/words/:word_id', removeWordFromDeck);

export default router;
