// server/controllers/missedWords.js - Controller logic for missed words tracking
import pool from '../config/db.js';

export const upsertMissedWord = async (req, res, next) => {
  try {
    const { word_id } = req.body;
    const user_id = req.user ? req.user.id : (req.session && req.session.user ? req.session.user.id : null);

    if (!user_id) {
      return res.status(401).json({ error: 'Unauthorized', code: 'UNAUTHORIZED' });
    }

    if (!word_id) {
      return res.status(400).json({ error: 'word_id is required' });
    }

    const result = await pool.query(
      `INSERT INTO missed_words (user_id, word_id, miss_count, last_missed_at)
       VALUES ($1, $2, 1, NOW())
       ON CONFLICT (user_id, word_id) DO UPDATE SET
         miss_count = missed_words.miss_count + 1,
         last_missed_at = NOW()
       RETURNING *`,
      [user_id, word_id]
    );

    return res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

export const getMissedWords = async (req, res, next) => {
  try {
    const user_id = req.user ? req.user.id : (req.session && req.session.user ? req.session.user.id : null);

    if (!user_id) {
      return res.status(401).json({ error: 'Unauthorized', code: 'UNAUTHORIZED' });
    }

    const result = await pool.query(
      `SELECT mw.id, mw.user_id, mw.word_id, mw.miss_count, mw.last_missed_at,
              w.characters, w.chinese_reading, w.japanese_reading,
              w.chinese_meaning, w.japanese_meaning, w.relationship_tag
       FROM missed_words mw
       JOIN words w ON mw.word_id = w.id
       WHERE mw.user_id = $1
       ORDER BY mw.miss_count DESC, mw.last_missed_at DESC`,
      [user_id]
    );

    return res.status(200).json(result.rows);
  } catch (error) {
    next(error);
  }
};
