# Session P9: Mario Kart RNG Weapons & Rubber-Banding System Plan

## Overview
This document details the implementation of Mario Kart-style RNG weapon items and a rubber-banding drop probability system for multiplayer rooms in Tandem.

## Deliverables
1. **Database Migrations (`server/db/migrations/001_p9_mario_kart_weapons.sql`)**
   - Created `rooms`, `room_players`, `messages`, `inventory`, and `weapon_events` tables.
   - Updated `server/config/reset.js` to drop and recreate all multiplayer and weapons tables during `npm run db:reset`.

2. **Weapon Definitions & Client Effects**
   - `Ink_Splat`: Dark semi-transparent overlay covering 40% of choice buttons (5s).
   - `Smoke_Screen`: CSS `filter: blur(6px)` on choice button text (5s).
   - `Timer_Freeze`: Frozen visual (shake animation) + pointer-events disabled (2s).
   - `Button_Shuffle`: Re-orders the 4 choice buttons randomly using CSS `order` property (until answered).
   - `Shield_Block`: Absorbs the next incoming weapon event (1 hit / passive defense).
   - `Lightning_Strike`: Reduces target's timer by 3 seconds instantly.

3. **Rubber-Banding Drop System (`server/utils/itemDrop.js`)**
   - Calculates drop probability based on rank:
     - Rank 1 (leader): 5%
     - Rank 2–3: 20%
     - Rank 4 – 50% of players: 40%
     - Bottom 50% – 2nd to last: 65%
     - Last place: 85%
   - Excludes `Shield_Block` for rank 1 leader.

4. **Server API Routes (`server/routes/rooms.js` & `server/routes/ai.js`)**
   - `GET /api/rooms/:roomId/question-start`: Triggers item drop for room players at question start.
   - `POST /api/rooms/:roomId/weapons/use`: Validates inventory weapon slot, logs `weapon_events`, and clears attacker's weapon slot.
   - `GET /api/rooms/:roomId/weapons/active`: Retrieves active weapon events targeting current user.
   - `PATCH /api/rooms/:roomId/weapons/:eventId/expire`: Expires a weapon event (e.g. absorbed by Shield_Block).
   - `GET /api/rooms/:roomId/ai-action`: AI opponent action logic taking active debuffs into account.

5. **React Frontend Integration**
   - `ItemBox.jsx`: Weapon slot display, target selector, polling, and shield absorption.
   - `useAI.js` & `AIOpponentCard.jsx`: Tandem Bot AI opponent hook and card component.
   - `PlayPage.jsx` & `QuestionCard.jsx`: Integration of ItemBox, AI opponent, timer reductions, and CSS overlay/blur/shake/shuffle classes.

6. **Playwright Tests (`tests/f09.spec.js`)**
   - Tests weapon usage without active weapon returns 400.
   - Tests active weapons list returns empty array initially.
   - Unit tests rubber-banding drop probability scaling by rank.

## 6-Tier Call Stack Diagram for POST /api/rooms/:roomId/weapons/use

```
Project(tandem)
└── server/routes/rooms.js → POST /api/rooms/:roomId/weapons/use
    └── requireAuth middleware
        └── weaponsController.useWeapon(req, res)
            ├── db.query("SELECT offensive_slot FROM inventory WHERE room_id=$1 AND user_id=$2")
            ├── db.query("INSERT INTO weapon_events(room_id, attacker_id, target_id, weapon_type, expires_at) VALUES(...)")
            └── db.query("UPDATE inventory SET offensive_slot=NULL WHERE room_id=$1 AND user_id=$2")
                └── row: { weapon_event_id, attacker_id, target_id, weapon_type, expires_at }
```
