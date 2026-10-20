// server/controllers/wordsController.js - Words controller logic
import pool from '../config/db.js';

// Helper to shuffle array in-place
const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

// GET /api/words/random?direction=cn_to_jp
export const getRandomWord = async (req, res) => {
  try {
    const direction = req.query.direction || 'cn_to_jp';
    const isCnToJp = direction === 'cn_to_jp';

    // Get 1 random target word
    const targetResult = await pool.query('SELECT * FROM words ORDER BY RANDOM() LIMIT 1');
    if (targetResult.rows.length === 0) {
      return res.status(404).json({ error: 'No words found in database' });
    }
    const targetWord = targetResult.rows[0];

    // Get 3 random distractor words excluding the target word
    const distractorsResult = await pool.query(
      'SELECT * FROM words WHERE id != $1 ORDER BY RANDOM() LIMIT 3',
      [targetWord.id]
    );

    const targetMeaningKey = isCnToJp ? 'japanese_meaning' : 'chinese_meaning';
    const correctAnswer = targetWord[targetMeaningKey];

    const distractorMeanings = distractorsResult.rows.map(row => row[targetMeaningKey]);
    const options = shuffleArray([correctAnswer, ...distractorMeanings]);

    res.status(200).json({
      ...targetWord,
      direction,
      correct_answer: correctAnswer,
      options
    });
  } catch (error) {
    console.error('Error fetching random word:', error);
    res.status(500).json({ error: 'Failed to fetch random word', details: error.message });
  }
};

// GET /api/words
export const getAllWords = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM words ORDER BY id ASC');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching words:', error);
    res.status(500).json({ error: 'Failed to fetch words', details: error.message });
  }
};

// GET /api/words/:id
export const getWordById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM words WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Word not found' });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching word by ID:', error);
    res.status(500).json({ error: 'Failed to fetch word', details: error.message });
  }
};
