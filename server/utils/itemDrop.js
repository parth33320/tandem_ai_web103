// server/utils/itemDrop.js - Rubber-banding item drop system
import pool from '../config/db.js';

export const WEAPONS = [
  'Ink_Splat',
  'Smoke_Screen',
  'Timer_Freeze',
  'Button_Shuffle',
  'Shield_Block',
  'Lightning_Strike'
];

export const LIFELINES = [
  'Fifty_Fifty',
  'Hint_Provider',
  'Expert_Advice'
];

/**
 * Calculates drop probability based on player rank and total players.
 * Rank 1 (leader): 5% (0.05)
 * Rank 2-3: 20% (0.20)
 * Rank 4 - 50% of players: 40% (0.40)
 * Bottom 50% - 2nd last: 65% (0.65)
 * Last place: 85% (0.85)
 */
export const getDropProbability = (rank, totalPlayers) => {
  if (totalPlayers <= 0) return 0;
  if (totalPlayers === 1) return 0.05; // Single player / Leader rank

  if (rank === totalPlayers) {
    return 0.85; // Last place
  }
  if (rank === 1) {
    return 0.05; // Leader
  }
  if (rank === 2 || rank === 3) {
    return 0.20;
  }

  const topHalfEnd = Math.ceil(totalPlayers * 0.5);
  if (rank >= 4 && rank <= topHalfEnd) {
    return 0.40;
  }

  return 0.65; // Bottom 50% to 2nd last
};

/**
 * Executes rubber-banding item drop for all players in a room.
 * Called at the start of each question.
 */
export const itemDrop = async (roomId) => {
  const client = await pool.connect();
  try {
    const playersRes = await client.query(
      `SELECT user_id, score FROM room_players WHERE room_id = $1 ORDER BY score DESC, id ASC`,
      [roomId]
    );

    const players = playersRes.rows;
    const totalPlayers = players.length;
    const results = [];

    for (let i = 0; i < totalPlayers; i++) {
      const player = players[i];
      const rank = i + 1;
      const prob = getDropProbability(rank, totalPlayers);

      const weaponRoll = Math.random();
      const weaponDropped = weaponRoll < prob;

      const lifelineRoll = Math.random();
      const lifelineDropped = lifelineRoll < prob;

      let weapon = null;
      if (weaponDropped) {
        let availableWeapons = WEAPONS;
        if (rank === 1) {
          availableWeapons = WEAPONS.filter(w => w !== 'Shield_Block');
        }
        weapon = availableWeapons[Math.floor(Math.random() * availableWeapons.length)];
      }

      let lifeline = null;
      if (lifelineDropped) {
        lifeline = LIFELINES[Math.floor(Math.random() * LIFELINES.length)];
      }

      if (weapon || lifeline) {
        await client.query(
          `INSERT INTO inventory (room_id, user_id, offensive_slot, passive_slot, updated_at)
           VALUES ($1, $2, $3, $4, NOW())
           ON CONFLICT (room_id, user_id)
           DO UPDATE SET
             offensive_slot = CASE WHEN $3 IS NOT NULL THEN $3 ELSE inventory.offensive_slot END,
             passive_slot   = CASE WHEN $4 IS NOT NULL THEN $4 ELSE inventory.passive_slot END,
             updated_at     = NOW()`,
          [roomId, player.user_id, weapon, lifeline]
        );
      }

      results.push({
        userId: player.user_id,
        rank,
        probability: prob,
        weaponDropped,
        weapon,
        lifelineDropped,
        lifeline
      });
    }

    return results;
  } finally {
    client.release();
  }
};

export default itemDrop;
