// server/index.js - Express Server Entry Point
import express from 'express';
import cors from 'cors';
import session from 'express-session';
import connectPgSimple from 'connect-pg-simple';
import dotenv from 'dotenv';
import pool from './config/db.js';
import passport from './config/passport.js';

import wordsRouter from './routes/words.js';
import decksRouter from './routes/decks.js';
import scoresRouter from './routes/scores.js';
import missedWordsRouter from './routes/missedWords.js';
import resetRouter from './routes/reset.js';
import authRouter from './routes/auth.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const PgStore = connectPgSimple(session);

// Session middleware configuration with connect-pg-simple store
app.use(
  session({
    store: new PgStore({
      pool,
      tableName: 'sessions',
      createTableIfMissing: true,
    }),
    secret: process.env.SESSION_SECRET || 'tandem_secret_key_123',
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      secure: false, // set to true if using HTTPS in production
    },
  })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/api/words', wordsRouter);
app.use('/api/decks', decksRouter);
app.use('/api/scores', scoresRouter);
app.use('/api/missed-words', missedWordsRouter);
app.use('/', authRouter);
app.use('/api', resetRouter);

// Root route healthcheck
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Tandem API Server Running' });
});

// 404 handler for undefined API routes
app.use((req, res, next) => {
  res.status(404).json({ error: 'Not found', code: 'NOT_FOUND' });
});

// Global Express error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  const status = err.status || err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  const code = err.code || 'INTERNAL_SERVER_ERROR';

  res.status(status).json({
    error: message,
    code: code
  });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

export default app;
