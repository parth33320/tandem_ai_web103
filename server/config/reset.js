// server/config/reset.js - Reset database schema and seed initial data
import pool from './db.js';

export const resetDatabase = async () => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Drop tables in reverse dependency order
    await client.query(`
      DROP TABLE IF EXISTS scores CASCADE;
      DROP TABLE IF EXISTS missed_words CASCADE;
      DROP TABLE IF EXISTS deck_words CASCADE;
      DROP TABLE IF EXISTS decks CASCADE;
      DROP TABLE IF EXISTS words CASCADE;
      DROP TABLE IF EXISTS user_profiles CASCADE;
      DROP TABLE IF EXISTS users CASCADE;
    `);

    // Create 7 tables with exact constraints
    await client.query(`
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        github_id TEXT UNIQUE NOT NULL,
        username TEXT NOT NULL,
        avatar_url TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE TABLE user_profiles (
        id SERIAL PRIMARY KEY,
        user_id INTEGER UNIQUE REFERENCES users(id) ON DELETE CASCADE,
        total_rounds_played INTEGER DEFAULT 0,
        best_score_cn_jp INTEGER DEFAULT 0,
        best_score_jp_cn INTEGER DEFAULT 0
      );

      CREATE TABLE words (
        id SERIAL PRIMARY KEY,
        characters TEXT NOT NULL,
        chinese_reading TEXT NOT NULL,
        japanese_reading TEXT NOT NULL,
        chinese_meaning TEXT NOT NULL,
        japanese_meaning TEXT NOT NULL,
        relationship_tag TEXT NOT NULL CHECK (relationship_tag IN ('true_friend','false_friend','half_friend'))
      );

      CREATE TABLE decks (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        title TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE TABLE deck_words (
        id SERIAL PRIMARY KEY,
        deck_id INTEGER REFERENCES decks(id) ON DELETE CASCADE,
        word_id INTEGER REFERENCES words(id) ON DELETE CASCADE,
        position INTEGER NOT NULL DEFAULT 0,
        UNIQUE(deck_id, word_id)
      );

      CREATE TABLE missed_words (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        word_id INTEGER REFERENCES words(id) ON DELETE CASCADE,
        miss_count INTEGER DEFAULT 1,
        last_missed_at TIMESTAMPTZ DEFAULT NOW(),
        UNIQUE(user_id, word_id)
      );

      CREATE TABLE scores (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        direction TEXT NOT NULL CHECK (direction IN ('cn_to_jp','jp_to_cn')),
        score INTEGER NOT NULL,
        similarity_pct INTEGER NOT NULL,
        played_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // Seed words with exactly 10 rows of real CN/JP shared-character pairs
    // Row 1 MUST be 手紙 (false friend: Letter vs Toilet paper)
    const wordsData = [
      ['手紙', 'shǒuzhǐ', 'tegami', 'Toilet paper', 'Letter', 'false_friend'],
      ['勉強', 'miǎnqiǎng', 'benkyō', 'Forced / reluctance', 'Study', 'false_friend'],
      ['汽車', 'qìchē', 'kisha', 'Automobile', 'Steam train', 'false_friend'],
      ['愛人', 'àiren', 'aijin', 'Spouse', 'Mistress / lover', 'false_friend'],
      ['大家', 'dàjiā', 'ōya', 'Everyone', 'Landlord', 'false_friend'],
      ['走', 'zǒu', 'hashiru', 'Walk', 'Run', 'half_friend'],
      ['新聞', 'xīnwén', 'shinbun', 'News', 'Newspaper', 'half_friend'],
      ['先生', 'xiānsheng', 'sensei', 'Mister / sir', 'Teacher', 'half_friend'],
      ['銀行', 'yínháng', 'ginkō', 'Bank', 'Bank', 'true_friend'],
      ['學生', 'xuésheng', 'gakusei', 'Student', 'Student', 'true_friend']
    ];

    for (const word of wordsData) {
      await client.query(
        `INSERT INTO words (characters, chinese_reading, japanese_reading, chinese_meaning, japanese_meaning, relationship_tag)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        word
      );
    }

    await client.query('COMMIT');
    console.log('Database successfully reset and seeded with 10 words.');
    return { success: true, count: wordsData.length };
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error resetting database:', error);
    throw error;
  } finally {
    client.release();
  }
};

// If run directly via node CLI
if (process.argv[1] && process.argv[1].endsWith('reset.js')) {
  resetDatabase()
    .then(() => {
      console.log('Reset complete.');
      process.exit(0);
    })
    .catch((err) => {
      console.error('Reset failed:', err);
      process.exit(1);
    });
}

export default resetDatabase;
