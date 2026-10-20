# Phase 5 Execution Trace & Architecture Plan: F-05 Split Direction Leaderboard

## Executive Summary
This document details the 6-tier call stack trace for Feature Slice F-05: Split Direction Leaderboard + Dynamic Option Restriction, tracing the `GET /api/scores/leaderboard?direction=cn_to_jp&limit=10` query flow from user page load down through React component mount, client API service, server routing, input validation controller logic, database join query execution, and payload rendering in the Presenter component.

---

## 6-Tier Call Stack Diagram: GET /api/scores/leaderboard Flow

```
Execution Call Stack Trace: Leaderboard Retrieval (GET /api/scores/leaderboard)
└── [Project] Tandem Fullstack Web App (Browser Client <-> Express Server API)
    ├── [Configuration/Env] PORT=3000, NODE_ENV=development, PGHOST=localhost, PGDATABASE=tandem
    ├── [Folder] client/src/
    │   └── [File] client/src/pages/LeaderboardPage.jsx
    │       └── [Component] LeaderboardPage (Container)
    │           ├── [Lifecycle] useEffect() on mount -> triggers fetchLeaderboards()
    │           └── [Folder] client/src/services/
    │               └── [File] client/src/services/api.js
    │                   └── [Method] getLeaderboard(direction = 'cn_to_jp', limit = 10)
    │                       └── [Project] Network Hop: GET /api/scores/leaderboard?direction=cn_to_jp&limit=10
    ├── [Folder] server/
    │   └── [File] server/index.js
    │       └── [Middleware] app.use('/api/scores', scoresRouter)
    │           └── [Folder] server/routes/
    │               └── [File] server/routes/scores.js
    │                   └── [Route Handler] GET /leaderboard -> scoresController.getLeaderboard
    ├── [Folder] server/controllers/
    │   └── [File] server/controllers/scoresController.js
    │       └── [Method] getLeaderboard(req, res, next)
    │           ├── [Variable State Shift] Inbound Param: req.query.direction = 'cn_to_jp', req.query.limit = '10'
    │           ├── [Branch Decision] IF direction NOT IN ('cn_to_jp', 'jp_to_cn') THEN
    │           │   └── [HTTP Response] status 400 JSON { error: "Invalid direction parameter. Must be 'cn_to_jp' or 'jp_to_cn'." }
    │           └── [Branch Decision] ELSE
    │               ├── [Variable State Shift] Validated direction = 'cn_to_jp', parsed limit = 10
    │               └── [Folder] server/config/
    │                   └── [File] server/config/db.js
    │                       └── [Method] pool.query("SELECT s.id, s.user_id, s.direction, s.score, s.similarity_pct, s.played_at, u.username, u.avatar_url FROM scores s JOIN users u ON s.user_id = u.id WHERE s.direction = $1 ORDER BY s.score DESC, s.played_at DESC LIMIT $2", ['cn_to_jp', 10])
    └── [Database] PostgreSQL
        └── [Table] scores JOIN users
            └── [SQL Execution] SELECT s.id, s.user_id, s.direction, s.score, s.similarity_pct, s.played_at, u.username, u.avatar_url FROM scores s JOIN users u ON s.user_id = u.id WHERE s.direction = $1 ORDER BY s.score DESC, s.played_at DESC LIMIT $2
                └── [Return Payload] Leaderboard Rows JSON [{ id, user_id, direction, score, similarity_pct, played_at, username, avatar_url }] -> HTTP 200 OK JSON
```

---

## Session Status & Resume Instructions
Documentation for F-05 Split Direction Leaderboard 6-tier call stack trace is created and verified.
Proceed to backend implementation of scores routes, controllers, auth middleware, and error handling.
