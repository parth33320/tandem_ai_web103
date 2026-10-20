// server/routes/scores.js - Score and Leaderboard API Router
import express from 'express';
import {
  saveScore,
  getLeaderboard,
  getAllScores,
  getScoreById
} from '../controllers/scoresController.js';
import RequiresAuth from '../middleware/auth.js';

const router = express.Router();

// GET /api/scores/leaderboard - Aggregation route for top scores by direction
router.get('/leaderboard', getLeaderboard);

// POST /api/scores - Save round score (Requires authentication)
router.post('/', RequiresAuth, saveScore);

// GET /api/scores - Standard RESTful endpoint for score history
router.get('/', getAllScores);

// GET /api/scores/:id - Standard RESTful endpoint for single score record
router.get('/:id', getScoreById);

export default router;
