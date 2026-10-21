// server/config/passport.js - Passport.js GitHub OAuth strategy configuration
import passport from 'passport';
import { Strategy as GitHubStrategy } from 'passport-github2';
import pool from './db.js';

const clientID = process.env.GITHUB_CLIENT_ID || 'dummy_id';
const clientSecret = process.env.GITHUB_CLIENT_SECRET || 'dummy_secret';
const callbackURL = process.env.GITHUB_CALLBACK_URL || 'http://localhost:3000/auth/github/callback';

passport.use(
  new GitHubStrategy(
    {
      clientID,
      clientSecret,
      callbackURL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const github_id = String(profile.id);
        const username = profile.username || profile.displayName || 'GitHub User';
        const avatar_url =
          profile.photos && profile.photos[0] ? profile.photos[0].value : null;

        // Upsert users table on github_id
        const userResult = await pool.query(
          `INSERT INTO users (github_id, username, avatar_url)
           VALUES ($1, $2, $3)
           ON CONFLICT (github_id) DO UPDATE SET
             username = EXCLUDED.username,
             avatar_url = EXCLUDED.avatar_url
           RETURNING *`,
          [github_id, username, avatar_url]
        );

        const user = userResult.rows[0];

        // Upsert user_profiles row
        await pool.query(
          `INSERT INTO user_profiles (user_id)
           VALUES ($1)
           ON CONFLICT (user_id) DO NOTHING`,
          [user.id]
        );

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return done(null, false);
    }
    return done(null, result.rows[0]);
  } catch (err) {
    return done(err, null);
  }
});

export default passport;
