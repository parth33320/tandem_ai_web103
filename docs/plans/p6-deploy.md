# Deployment Plan & Verification (p6-deploy.md)

## Render Deployment Plan

### Configuration Overview
- **Service Name:** `tandem-server`
- **Type:** Web Service (Node.js)
- **Database:** `tandem-db` (PostgreSQL)
- **Build Command:** `cd server && npm install`
- **Start Command:** `cd server && npm start`

### Environment Variables
- `PORT`: Dynamically assigned by Render (Express listens on `process.env.PORT || 3000`).
- `DATABASE_URL`: Automatically populated by Render via link to `tandem-db`.
- `NODE_ENV`: Set to `production` (enables SSL configuration with `{ rejectUnauthorized: false }` for PostgreSQL connection pooling in `server/config/db.js`).

### Client / Server Proxy & Static Files
- For local development, `client/vite.config.js` proxies `/api` and `/auth` routes to `http://localhost:3001`.
- `client/package.json` provides scripts `"build": "vite build"` and `"preview": "vite preview"`.

### Database Reset & Seeding Procedure
- Server exposes `GET /api/reset` to reset and seed tables in test/production environments.
- CLI script `npm run db:reset` (`node server/config/reset.js`) provisions schema and seeds default word data and starter decks.

### Deployment Verification Sequence
1. Connect PostgreSQL database `tandem-db` to web service `tandem-server`.
2. Deploy backend service and verify health check at `/`.
3. Trigger database reset endpoint or run seed script to initialize schema (`users`, `user_profiles`, `words`, `decks`, `deck_words`, `missed_words`, `scores`).
4. Perform final smoke test walkthrough:
   - Home -> Game Direction Select (`cn_to_jp` / `jp_to_cn`)
   - 10-Question Quiz Round -> Timer Countdown & Answer Validation
   - Results Dashboard -> False Friend Similarity Meter Output
   - Split Direction Leaderboards -> Switch Track Toggle
   - Deck Creator Dashboard -> CRUD Deck Operations
   - User Profile Page -> Missed Words History
