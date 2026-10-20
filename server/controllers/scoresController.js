// server/controllers/scoresController.js - Score and Leaderboard controller logic
import pool from '../config/db.js';

// POST /api/scores - Save round score (RequiresAuth)
export const saveScore = async (req, res, next) => {
  try {
    const { direction, score, similarity_pct } = req.body || {};
    const user = req.user || (req.session && req.session.user);

    if (!user || !user.id) {
      return res.status(401).json({ error: 'Unauthorized. Please log in.' });
    }

    // Validate direction
    if (!direction || !['cn_to_jp', 'jp_to_cn'].includes(direction)) {
      return res.status(400).json({ error: "Invalid direction. Must be 'cn_to_jp' or 'jp_to_cn'." });
    }

    // Validate score
    const parsedScore = Number(score);
    if (score === undefined || score === null || isNaN(parsedScore) || parsedScore < 0 || parsedScore > 100) {
      return res.status(400).json({ error: 'Invalid score. Must be a number between 0 and 100.' });
    }

    // Validate similarity_pct
    const parsedSimilarity = Number(similarity_pct);
    if (similarity_pct === undefined || similarity_pct === null || isNaN(parsedSimilarity) || parsedSimilarity < 0 || parsedSimilarity > 100) {
      return res.status(400).json({ error: 'Invalid similarity_pct. Must be a number between 0 and 100.' });
    }

    const userId = user.id;

    // Insert score into database
    const scoreResult = await pool.query(
      `INSERT INTO scores (user_id, direction, score, similarity_pct)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [userId, direction, parsedScore, parsedSimilarity]
    );

    const savedScore = scoreResult.rows[0];

    // Update user profile statistics
    await pool.query(
      `INSERT INTO user_profiles (user_id, total_rounds_played, best_score_cn_jp, best_score_jp_cn)
       VALUES ($1, 1, CASE WHEN $2 = 'cn_to_jp' THEN $3 ELSE 0 END, CASE WHEN $2 = 'jp_to_cn' THEN $3 ELSE 0 END)
       ON CONFLICT (user_id) DO UPDATE SET
         total_rounds_played = user_profiles.total_rounds_played + 1,
         best_score_cn_jp = CASE WHEN $2 = 'cn_to_jp' THEN GREATEST(user_profiles.best_score_cn_jp, $3) ELSE user_profiles.best_score_cn_jp END,
         best_score_jp_cn = CASE WHEN $2 = 'jp_to_cn' THEN GREATEST(user_profiles.best_score_jp_cn, $3) ELSE user_profiles.best_score_jp_cn END`,
      [userId, direction, parsedScore]
    );

    return res.status(201).json(savedScore);
  } catch (error) {
    next(error);
  }
};

// GET /api/scores/leaderboard?direction=cn_to_jp&limit=10 - Fetch top leaderboard entries
export const getLeaderboard = async (req, res, next) => {
  try {
    const direction = req.query.direction || 'cn_to_jp';
    const limit = Math.min(Math.max(parseInt(req.query.limit || '10', 10), 1), 100);

    if (!['cn_to_jp', 'jp_to_cn'].includes(direction)) {
      return res.status(400).json({ error: "Invalid direction parameter. Must be 'cn_to_jp' or 'jp_to_cn'." });
    }

    const result = await pool.query(
      `SELECT s.id, s.user_id, s.direction, s.score, s.similarity_pct, s.played_at,
              u.username, u.avatar_url
       FROM scores s
       JOIN users u ON s.user_id = u.id
       WHERE s.direction = $1
       ORDER BY s.score DESC, s.played_at DESC
       LIMIT $2`,
      [direction, limit]
    );

    return res.status(200).json(result.rows);
  } catch (error) {
    next(error);
  }
};

// GET /api/scores - Standard RESTful endpoint to get scores list
export const getAllScores = async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT s.*, u.username, u.avatar_url
       FROM scores s
       LEFT JOIN users u ON s.user_id = u.id
       ORDER BY s.played_at DESC
       LIMIT 100`
    );
    return res.status(200).json(result.rows);
  } catch (error) {
    next(error);
  }
};

// GET /api/scores/:id - Standard RESTful endpoint to get single score by id
export const getScoreById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `SELECT s.*, u.username, u.avatar_url
       FROM scores s
       LEFT JOIN users u ON s.user_id = u.id
       WHERE s.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Score not found' });
    }

    return res.status(200).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};
