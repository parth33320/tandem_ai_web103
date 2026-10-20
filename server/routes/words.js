// server/routes/words.js - Words API router
import express from 'express';
import { getRandomWord, getAllWords, getWordById } from '../controllers/wordsController.js';

const router = express.Router();

router.get('/random', getRandomWord);
router.get('/', getAllWords);
router.get('/:id', getWordById);

export default router;
