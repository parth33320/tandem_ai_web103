// server/config/reset.js - Reset database schema and seed initial data
import pool from './db.js';

export const resetDatabase = async () => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Drop tables in reverse dependency order
    await client.query(`
      DROP TABLE IF EXISTS weapon_events CASCADE;
      DROP TABLE IF EXISTS inventory CASCADE;
      DROP TABLE IF EXISTS messages CASCADE;
      DROP TABLE IF EXISTS room_players CASCADE;
      DROP TABLE IF EXISTS rooms CASCADE;
      DROP TABLE IF EXISTS scores CASCADE;
      DROP TABLE IF EXISTS missed_words CASCADE;
      DROP TABLE IF EXISTS deck_words CASCADE;
      DROP TABLE IF EXISTS decks CASCADE;
      DROP TABLE IF EXISTS words CASCADE;
      DROP TABLE IF EXISTS user_profiles CASCADE;
      DROP TABLE IF EXISTS users CASCADE;
    `);

    // Create tables with exact constraints
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

      CREATE TABLE rooms (
        id SERIAL PRIMARY KEY,
        code VARCHAR(10) UNIQUE NOT NULL,
        host_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        status VARCHAR(20) DEFAULT 'waiting',
        current_question_index INTEGER DEFAULT 0,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE TABLE room_players (
        id SERIAL PRIMARY KEY,
        room_id INTEGER REFERENCES rooms(id) ON DELETE CASCADE,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        score INTEGER DEFAULT 0,
        joined_at TIMESTAMPTZ DEFAULT NOW(),
        UNIQUE(room_id, user_id)
      );

      CREATE TABLE messages (
        id SERIAL PRIMARY KEY,
        room_id INTEGER REFERENCES rooms(id) ON DELETE CASCADE,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        text TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE TABLE inventory (
        id            SERIAL PRIMARY KEY,
        room_id       INTEGER REFERENCES rooms(id) ON DELETE CASCADE,
        user_id       INTEGER REFERENCES users(id) ON DELETE CASCADE,
        offensive_slot VARCHAR(40),
        passive_slot   VARCHAR(40),
        updated_at    TIMESTAMPTZ DEFAULT NOW(),
        UNIQUE(room_id, user_id)
      );

      CREATE TABLE weapon_events (
        id           SERIAL PRIMARY KEY,
        room_id      INTEGER REFERENCES rooms(id) ON DELETE CASCADE,
        attacker_id  INTEGER REFERENCES users(id),
        target_id    INTEGER REFERENCES users(id),
        weapon_type  VARCHAR(40) NOT NULL,
        expires_at   TIMESTAMPTZ NOT NULL,
        created_at   TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // Seed words with exactly 10 rows of real CN/JP shared-character pairs
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
