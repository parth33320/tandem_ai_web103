# Session P10: Passive Lifeline Power-Ups & Rubber-Banding Plan

## Overview
This document details the implementation of "Who Wants to Be a Millionaire"-style lifeline mechanics as passive power-ups running locally with data in PostgreSQL for Tandem.

## Deliverables Summary

1. **Schema Migration & Seed Data**
   - Migration file: `server/db/migrations/002_p10_lifelines.sql`
   - Seed script: `db/seed.sql` and `server/config/reset.js` updated with `fun_fact`, `jp_meaning_note`, and `zh_meaning_note` TEXT columns and seeded sample values for demo words.

2. **Passive Lifeline Definitions**
   - `Fifty_Fifty`: Keeps correct answer choice visible, picks 2 wrong answer buttons at random using `Math.random()`, applies CSS class `.hidden` (`display: none`). One-time use per round.
   - `Hint_Provider`: Reads `jp_meaning_note` (if direction is `cn_to_jp` / `cn_jp`) or `zh_meaning_note` (if direction is `jp_to_cn` / `jp_cn`) for the current word. Renders text bubble overlay below `QuestionCard`. Fallback text: `"No hint available for this word."`. One-time use per round.
   - `Expert_Advice`: Client-side calculation. Reads correct answer index. Runs `Math.random()` to assign 65–80% probability weight to the correct answer and distributes remaining weight across wrong answers. Renders pure CSS bar chart overlay showing `"Expert A: [answer] (X%)"`, `"Expert B: ..."`, `"Expert C: ..."`. One-time use per round.

3. **Rubber-Banding Lifeline Drop (`server/utils/itemDrop.js`)**
   - Extended `itemDrop(roomId)` to assign passive lifelines (`Fifty_Fifty`, `Hint_Provider`, `Expert_Advice`) using rank-bucket drop probabilities.
   - Dual slot rule: player can hold ONE `offensive_slot` weapon AND ONE `passive_slot` lifeline simultaneously in `inventory`.

4. **Server Routes (`server/routes/rooms.js`)**
   - `POST /api/rooms/:roomId/lifelines/use`: requireAuth middleware; validates `passive_slot` matches `lifelineType`, sets `passive_slot = NULL` in inventory, and returns 200 `{ success: true, lifelineType }`.

5. **React Components**
   - `FiftyFiftyBtn.jsx`, `HintBubble.jsx`, `ExpertChart.jsx`, `LifelinePanel.jsx`.
   - `PlayPage.jsx` & `QuestionCard.jsx`: pass `hiddenChoiceIndexes`, `hintText`, `expertWeights` down to `QuestionCard`, apply `.hidden` class to choice buttons, render hint text bubble, and render pure CSS bar chart overlay. Reset lifeline state on each question load.

6. **Single-Player Lifeline Support**
   - Lifelines work via local React state (`singlePlayerLifelines`) without needing server inventory calls.

7. **Playwright Tests (`tests/f10.spec.js`)**
   - Validates `POST /api/rooms/:roomId/lifelines/use` clears `passive_slot` and returns 200.
   - Validates mismatched `lifelineType` returns 400.
   - Validates `GET /api/rooms/:roomId/inventory` returns inventory row with both `offensive_slot` and `passive_slot`.

## 6-Tier Call Stack Diagram for 50:50 Lifeline Activation

```
Project(tandem)
└── client/src/components/lifelines/FiftyFiftyBtn.jsx → onClick
    └── POST /api/rooms/:roomId/lifelines/use { lifelineType: 'Fifty_Fifty' }
        └── roomsController.useLifeline(req, res)
            └── db.query("UPDATE inventory SET passive_slot=NULL WHERE room_id=$1 AND user_id=$2")
                └── client: filters wrong choices → applies .hidden CSS class to 2 random wrong buttons
```
