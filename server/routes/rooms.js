// server/routes/rooms.js - Multiplayer Rooms, Weapons, and Lifelines API
import express from 'express';
import pool from '../config/db.js';
import requireAuth from '../middleware/requireAuth.js';
import { itemDrop } from '../utils/itemDrop.js';

const router = express.Router();

// Generate a random 6-character room code
const generateRoomCode = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

// POST /api/rooms — Create a room
router.post('/', requireAuth, async (req, res, next) => {
  try {
    const code = generateRoomCode();
    const userId = req.user.id;

    const roomRes = await pool.query(
      `INSERT INTO rooms (code, host_id, status) VALUES ($1, $2, 'waiting') RETURNING *`,
      [code, userId]
    );
    const room = roomRes.rows[0];

    // Add host as player
    await pool.query(
      `INSERT INTO room_players (room_id, user_id, score) VALUES ($1, $2, 0) ON CONFLICT DO NOTHING`,
      [room.id, userId]
    );

    res.status(201).json(room);
  } catch (err) {
    next(err);
  }
});

// POST /api/rooms/join — Join room by code
router.post('/join', requireAuth, async (req, res, next) => {
  try {
    const { code } = req.body;
    const userId = req.user.id;

    if (!code) {
      return res.status(400).json({ error: 'Room code required' });
    }

    const roomRes = await pool.query(`SELECT * FROM rooms WHERE code = $1`, [code.trim().toUpperCase()]);
    if (roomRes.rows.length === 0) {
      return res.status(404).json({ error: 'Room not found' });
    }
    const room = roomRes.rows[0];

    await pool.query(
      `INSERT INTO room_players (room_id, user_id, score) VALUES ($1, $2, 0) ON CONFLICT DO NOTHING`,
      [room.id, userId]
    );

    res.json(room);
  } catch (err) {
    next(err);
  }
});

// GET /api/rooms/:roomId — Get room details and players
router.get('/:roomId', async (req, res, next) => {
  try {
    const { roomId } = req.params;
    const roomRes = await pool.query(`SELECT * FROM rooms WHERE id = $1`, [roomId]);
    if (roomRes.rows.length === 0) {
      return res.status(404).json({ error: 'Room not found' });
    }
    const room = roomRes.rows[0];

    const playersRes = await pool.query(
      `SELECT rp.*, u.username, u.avatar_url
       FROM room_players rp
       LEFT JOIN users u ON rp.user_id = u.id
       WHERE rp.room_id = $1
       ORDER BY rp.score DESC, rp.joined_at ASC`,
      [roomId]
    );

    res.json({ ...room, players: playersRes.rows });
  } catch (err) {
    next(err);
  }
});

// GET /api/rooms/:roomId/question-start — Triggers itemDrop for all room players
router.get('/:roomId/question-start', async (req, res, next) => {
  try {
    const { roomId } = req.params;

    // Run item drop logic
    const dropResults = await itemDrop(roomId);

    // Fetch updated inventory rows
    const inventoryRes = await pool.query(
      `SELECT * FROM inventory WHERE room_id = $1`,
      [roomId]
    );

    res.json({ results: dropResults, inventory: inventoryRes.rows });
  } catch (err) {
    next(err);
  }
});

// GET /api/rooms/:roomId/inventory — Fetch current player's inventory
router.get('/:roomId/inventory', async (req, res, next) => {
  try {
    const { roomId } = req.params;
    const userId = req.user ? req.user.id : req.query.user_id;

    if (!userId) {
      return res.json({ offensive_slot: null, passive_slot: null });
    }

    const invRes = await pool.query(
      `SELECT * FROM inventory WHERE room_id = $1 AND user_id = $2`,
      [roomId, userId]
    );

    if (invRes.rows.length === 0) {
      return res.json({ offensive_slot: null, passive_slot: null });
    }

    res.json(invRes.rows[0]);
  } catch (err) {
    next(err);
  }
});

// POST /api/rooms/:roomId/weapons/use — Use weapon item
router.post('/:roomId/weapons/use', requireAuth, async (req, res, next) => {
  try {
    const { roomId } = req.params;
    const { targetUserId, weaponType } = req.body;
    const attackerId = req.user.id;

    if (!weaponType) {
      return res.status(400).json({ error: 'weaponType is required' });
    }

    // Check inventory of attacker
    const invRes = await pool.query(
      `SELECT offensive_slot FROM inventory WHERE room_id = $1 AND user_id = $2`,
      [roomId, attackerId]
    );

    if (invRes.rows.length === 0 || invRes.rows[0].offensive_slot !== weaponType) {
      return res.status(400).json({ error: 'No active weapon or slot mismatch' });
    }

    // Determine duration
    let durationSeconds = 5;
    if (weaponType === 'Timer_Freeze') durationSeconds = 2;
    else if (weaponType === 'Button_Shuffle') durationSeconds = 30;
    else if (weaponType === 'Shield_Block') durationSeconds = 60;
    else if (weaponType === 'Lightning_Strike') durationSeconds = 0;

    // Create weapon_event
    const eventRes = await pool.query(
      `INSERT INTO weapon_events (room_id, attacker_id, target_id, weapon_type, expires_at)
       VALUES ($1, $2, $3, $4, NOW() + ($5 || ' seconds')::INTERVAL)
       RETURNING id AS weapon_event_id, id, room_id, attacker_id, target_id, weapon_type, expires_at, created_at`,
      [roomId, attackerId, targetUserId || null, weaponType, durationSeconds]
    );

    const event = eventRes.rows[0];

    // Clear offensive_slot from attacker's inventory
    await pool.query(
      `UPDATE inventory SET offensive_slot = NULL WHERE room_id = $1 AND user_id = $2`,
      [roomId, attackerId]
    );

    res.status(201).json(event);
  } catch (err) {
    next(err);
  }
});

// POST /api/rooms/:roomId/lifelines/use — Use passive lifeline item
router.post('/:roomId/lifelines/use', requireAuth, async (req, res, next) => {
  try {
    const { roomId } = req.params;
    const { lifelineType } = req.body;
    const userId = req.user.id;

    if (!lifelineType) {
      return res.status(400).json({ error: 'lifelineType is required' });
    }

    // Check inventory of user
    const invRes = await pool.query(
      `SELECT passive_slot FROM inventory WHERE room_id = $1 AND user_id = $2`,
      [roomId, userId]
    );

    if (invRes.rows.length === 0 || invRes.rows[0].passive_slot !== lifelineType) {
      return res.status(400).json({ error: 'No active lifeline or slot mismatch' });
    }

    // Clear passive_slot from user's inventory
    await pool.query(
      `UPDATE inventory SET passive_slot = NULL WHERE room_id = $1 AND user_id = $2`,
      [roomId, userId]
    );

    res.status(200).json({ success: true, lifelineType });
  } catch (err) {
    next(err);
  }
});

// GET /api/rooms/:roomId/weapons/active — Get active weapon events targeting current user
router.get('/:roomId/weapons/active', async (req, res, next) => {
  try {
    const { roomId } = req.params;
    const userId = req.user ? req.user.id : req.query.user_id;

    let query = `SELECT * FROM weapon_events WHERE room_id = $1 AND expires_at > NOW()`;
    let params = [roomId];

    if (userId) {
      query += ` AND (target_id = $2 OR target_id IS NULL)`;
      params.push(userId);
    }

    const eventsRes = await pool.query(query, params);
    res.json(eventsRes.rows);
  } catch (err) {
    next(err);
  }
});

// PATCH /api/rooms/:roomId/weapons/:eventId/expire — Set weapon event to expired
router.patch('/:roomId/weapons/:eventId/expire', async (req, res, next) => {
  try {
    const { eventId } = req.params;

    const updateRes = await pool.query(
      `UPDATE weapon_events SET expires_at = NOW() WHERE id = $1 RETURNING *`,
      [eventId]
    );

    if (updateRes.rows.length === 0) {
      return res.status(404).json({ error: 'Weapon event not found' });
    }

    res.json({ success: true, event: updateRes.rows[0] });
  } catch (err) {
    next(err);
  }
});

// Chat messages
router.get('/:roomId/messages', async (req, res, next) => {
  try {
    const { roomId } = req.params;
    const msgRes = await pool.query(
      `SELECT m.*, u.username FROM messages m LEFT JOIN users u ON m.user_id = u.id WHERE m.room_id = $1 ORDER BY m.created_at ASC`,
      [roomId]
    );
    res.json(msgRes.rows);
  } catch (err) {
    next(err);
  }
});

router.post('/:roomId/messages', requireAuth, async (req, res, next) => {
  try {
    const { roomId } = req.params;
    const { text } = req.body;
    const userId = req.user.id;

    if (!text || !text.trim()) {
      return res.status(400).json({ error: 'Text required' });
    }

    const msgRes = await pool.query(
      `INSERT INTO messages (room_id, user_id, text) VALUES ($1, $2, $3) RETURNING *`,
      [roomId, userId, text.trim()]
    );

    res.status(201).json(msgRes.rows[0]);
  } catch (err) {
    next(err);
  }
});

export default router;
