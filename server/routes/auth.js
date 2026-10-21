// server/routes/auth.js - Authentication and user status endpoints
import express from 'express';
import passport from '../config/passport.js';
import pool from '../config/db.js';

const router = express.Router();

// GET /auth/github - initiate GitHub OAuth flow
router.get('/auth/github', passport.authenticate('github', { scope: ['user:email'] }));

// GET /auth/github/callback - GitHub OAuth callback redirect
router.get(
  '/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/' }),
  (req, res) => {
    if (req.user && req.session) {
      req.session.user = req.user;
    }
    res.redirect('/');
  }
);

// GET /auth/logout - log out user and redirect to home
router.get('/auth/logout', (req, res, next) => {
  if (req.logout) {
    req.logout((err) => {
      if (err) return next(err);
      if (req.session) {
        req.session.destroy(() => {
          res.clearCookie('connect.sid');
          return res.redirect('/');
        });
      } else {
        return res.redirect('/');
      }
    });
  } else if (req.session) {
    req.session.destroy(() => {
      res.clearCookie('connect.sid');
      return res.redirect('/');
    });
  } else {
    return res.redirect('/');
  }
});

// POST /auth/logout or /api/auth/logout - JSON logout route
const jsonLogout = (req, res, next) => {
  const doLogout = () => {
    if (req.session) {
      req.session.destroy(() => {
        res.clearCookie('connect.sid');
        return res.status(200).json({ success: true, message: 'Logged out' });
      });
    } else {
      return res.status(200).json({ success: true, message: 'Logged out' });
    }
  };

  if (req.logout) {
    req.logout((err) => {
      if (err) return next(err);
      doLogout();
    });
  } else {
    doLogout();
  }
};

router.post('/auth/logout', jsonLogout);
router.post('/api/auth/logout', jsonLogout);

// GET /api/me - check current session auth status
router.get('/api/me', (req, res) => {
  const user = req.user || (req.session && req.session.user) || null;
  return res.status(200).json({ user });
});

// POST /api/auth/mock-login - helper endpoint for testing/dev login
router.post('/auth/mock-login', async (req, res, next) => {
  try {
    const username = req.body.username || 'Test User';
    const github_id = String(req.body.github_id || 'github_12345');
    const avatar_url =
      req.body.avatar_url || 'https://avatars.githubusercontent.com/u/100000?v=4';

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

router.post('/api/auth/mock-login', async (req, res, next) => {
  try {
    const username = req.body.username || 'Test User';
    const github_id = String(req.body.github_id || 'github_12345');
    const avatar_url =
      req.body.avatar_url || 'https://avatars.githubusercontent.com/u/100000?v=4';

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

export default router;
