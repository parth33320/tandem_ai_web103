// server/routes/reset.js - Reset API route
import express from 'express';
import resetDatabase from '../config/reset.js';

const router = express.Router();

router.get('/reset', async (req, res) => {
  try {
    const result = await resetDatabase();
    res.status(200).json({ message: 'Database reset successfully', result });
  } catch (error) {
    res.status(500).json({ error: 'Failed to reset database', details: error.message });
  }
});

export default router;
