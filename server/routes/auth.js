// server/routes/auth.js - Authentication and user status endpoints
import express from 'express';
import pool from '../config/db.js';

const router = express.Router();

// GET /api/me - check current session auth status
router.get('/me', (req, res) => {
  const user = req.user || (req.session && req.session.user);
  if (!user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  return res.status(200).json({ user });
});

// POST /api/auth/mock-login - helper endpoint for testing/dev login
router.post('/auth/mock-login', async (req, res, next) => {
  try {
    const username = req.body.username || 'Test User';
    const github_id = req.body.github_id || 'github_12345';
    const avatar_url = req.body.avatar_url || 'https://avatars.githubusercontent.com/u/100000?v=4';

    // Upsert user into users table
    const result = await pool.query(
      `INSERT INTO users (github_id, username, avatar_url)
       VALUES ($1, $2, $3)
       ON CONFLICT (github_id) DO UPDATE SET
         username = EXCLUDED.username,
         avatar_url = EXCLUDED.avatar_url
       RETURNING *`,
      [github_id, username, avatar_url]
    );

    const user = result.rows[0];

    // Initialize user profile if not present
    await pool.query(
      `INSERT INTO user_profiles (user_id)
       VALUES ($1)
       ON CONFLICT (user_id) DO NOTHING`,
      [user.id]
    );

    if (req.session) {
      req.session.user = user;
    }
    req.user = user;

    return res.status(200).json({ success: true, user });
  } catch (error) {
    next(error);
  }
});

// POST /api/auth/logout - destroy session
router.post('/auth/logout', (req, res) => {
  if (req.session) {
    req.session.destroy(() => {
      res.status(200).json({ success: true, message: 'Logged out' });
    });
  } else {
    res.status(200).json({ success: true, message: 'Logged out' });
  }
});

export default router;
