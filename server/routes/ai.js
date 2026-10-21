// server/routes/ai.js - AI Opponent Actions API
import express from 'express';
import pool from '../config/db.js';

const router = express.Router();

// GET /api/rooms/:roomId/ai-action
router.get('/:roomId/ai-action', async (req, res, next) => {
  try {
    const { roomId } = req.params;

    // Fetch active weapon events for this room targeting AI (or target_id = -1)
    const eventsRes = await pool.query(
      `SELECT weapon_type FROM weapon_events
       WHERE room_id = $1 AND (target_id = -1 OR target_id IS NULL) AND expires_at > NOW()`,
      [roomId]
    );

    const activeEvents = eventsRes.rows.map(r => r.weapon_type);

    const aiIsBlurred = activeEvents.includes('Smoke_Screen');
    const aiIsFrozen = activeEvents.includes('Timer_Freeze');
    const aiIsShuffled = activeEvents.includes('Button_Shuffle');

    let isCorrect = false;

    if (aiIsBlurred) {
      // 70% chance wrong answer
      isCorrect = Math.random() >= 0.70;
    } else if (aiIsShuffled) {
      // 50% chance wrong answer
      isCorrect = Math.random() >= 0.50;
    } else {
      // Normal: 60% correct answer
      isCorrect = Math.random() < 0.60;
    }

    // Base answer delay: 1 to 8 seconds
    let delay = Math.random() * 7 + 1;
    if (aiIsFrozen) {
      delay += 2; // Extra 2 seconds delay
    }

    res.json({
      correct: isCorrect,
      delay: Math.round(delay * 10) / 10,
      aiIsBlurred,
      aiIsFrozen,
      aiIsShuffled
    });
  } catch (err) {
    next(err);
  }
});

export default router;
