// server/routes/auth.js - Authentication and user status endpoints
import express from 'express';
import passport from '../config/passport.js';
import pool from '../config/db.js';
import requireAuth from '../middleware/requireAuth.js';

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

// GET /api/me - check current session auth status with avatar profile info
router.get('/api/me', async (req, res, next) => {
  try {
    const user = req.user || (req.session && req.session.user) || null;
    if (!user) {
      return res.status(200).json({ user: null });
    }

    const profileRes = await pool.query(
      'SELECT avatar_color, avatar_bg FROM user_profiles WHERE user_id = $1',
      [user.id]
    );

    let avatar_color = '#6c63ff';
    let avatar_bg = '#21253a';

    if (profileRes.rows.length > 0) {
      avatar_color = profileRes.rows[0].avatar_color || '#6c63ff';
      avatar_bg = profileRes.rows[0].avatar_bg || '#21253a';
    }

    const fullUser = {
      ...user,
      avatar_color,
      avatar_bg,
    };

    return res.status(200).json({ user: fullUser });
  } catch (error) {
    next(error);
  }
});

// PATCH /api/me/avatar - update avatar colors
router.patch('/api/me/avatar', requireAuth, async (req, res, next) => {
  try {
    const user = req.user || (req.session && req.session.user);
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized', code: 'UNAUTHORIZED' });
    }

    const avatar_color = req.body.avatar_color || '#6c63ff';
    const avatar_bg = req.body.avatar_bg || '#21253a';

    await pool.query(
      `INSERT INTO user_profiles (user_id, avatar_color, avatar_bg)
       VALUES ($1, $2, $3)
       ON CONFLICT (user_id) DO UPDATE SET
         avatar_color = EXCLUDED.avatar_color,
         avatar_bg = EXCLUDED.avatar_bg`,
      [user.id, avatar_color, avatar_bg]
    );

    // Update session user
    user.avatar_color = avatar_color;
    user.avatar_bg = avatar_bg;
    if (req.session) {
      req.session.user = { ...req.session.user, avatar_color, avatar_bg };
    }

    return res.status(200).json({ success: true, avatar_color, avatar_bg });
  } catch (error) {
    next(error);
  }
});

// Helper mock-login function
const handleMockLogin = async (req, res, next) => {
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

    const profileRes = await pool.query(
      `INSERT INTO user_profiles (user_id)
       VALUES ($1)
       ON CONFLICT (user_id) DO NOTHING
       RETURNING avatar_color, avatar_bg`,
      [user.id]
    );

    if (profileRes.rows.length > 0) {
      user.avatar_color = profileRes.rows[0].avatar_color || '#6c63ff';
      user.avatar_bg = profileRes.rows[0].avatar_bg || '#21253a';
    } else {
      user.avatar_color = '#6c63ff';
      user.avatar_bg = '#21253a';
    }

    if (req.session) {
      req.session.user = user;
    }
    req.user = user;

    return res.status(200).json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

router.post('/auth/mock-login', handleMockLogin);
router.post('/api/auth/mock-login', handleMockLogin);

export default router;
