// server/index.js - Express Server Entry Point
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import wordsRouter from './routes/words.js';
import decksRouter from './routes/decks.js';
import resetRouter from './routes/reset.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/words', wordsRouter);
app.use('/api/decks', decksRouter);
app.use('/api', resetRouter);

// Root route healthcheck
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Tandem API Server Running' });
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
