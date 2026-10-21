// server/routes/missedWords.js - Express router for missed words
import express from 'express';
import { upsertMissedWord, getMissedWords } from '../controllers/missedWords.js';
import requireAuth from '../middleware/requireAuth.js';

const router = express.Router();

router.post('/', requireAuth, upsertMissedWord);
router.get('/', requireAuth, getMissedWords);

export default router;
