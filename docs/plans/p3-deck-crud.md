# Phase 5 Execution Trace & Architecture Plan: F-03 Custom Deck Creator

## Executive Summary
This document details the 6-tier call stack trace for Feature Slice F-03: Custom Deck Creator, tracing the `POST /api/decks` creation flow from user form interaction down through client API handlers, server routing, validation controller logic, database insertion, and client-side navigation.

---

## 6-Tier Call Stack Diagram: POST /api/decks Creation Flow

```
Execution Call Stack Trace: Deck Creation (POST /api/decks)
└── [Project] Tandem Fullstack Web App (Browser Client <-> Express Server API)
    ├── [Configuration/Env] PORT=3000, NODE_ENV=development, PGHOST=localhost, PGDATABASE=tandem
    ├── [Folder] client/src/
    │   └── [File] client/src/components/DeckForm.jsx
    │       └── [Component] DeckForm (Presenter)
    │           ├── [Event] onSubmit -> triggers handleSubmit(e)
    │           └── [Method] onSubmit(title) -> invokes container handler
    │   └── [File] client/src/pages/DecksPage.jsx
    │       └── [Component] DecksPage (Container)
    │           └── [Method] handleCreateDeck(title)
    │               └── [Folder] client/src/services/
    │                   └── [File] client/src/services/api.js
    │                       └── [Method] createDeck(title)
    │                           └── [Project] Network Hop: POST /api/decks Body: { title }
    ├── [Folder] server/
    │   └── [File] server/index.js
    │       └── [Middleware] express.json(), app.use('/api/decks', decksRouter)
    │           └── [Folder] server/routes/
    │               └── [File] server/routes/decks.js
    │                   └── [Route Route Handler] POST / -> createDeck Controller
    ├── [Folder] server/controllers/
    │   └── [File] server/controllers/decksController.js
    │       └── [Method] createDeck(req, res, next)
    │           ├── [Branch Decision] IF title is missing, not string, trimmed empty, or > 80 chars THEN
    │           │   └── [HTTP Response] status 400 JSON { error: "Title is required and must be under 80 characters." }
    │           └── [Branch Decision] ELSE
    │               └── [Folder] server/config/
    │                   └── [File] server/config/db.js
    │                       └── [Method] pool.query("INSERT INTO decks (title) VALUES ($1) RETURNING *", [title])
    └── [Database] PostgreSQL
        └── [Table] decks
            └── [SQL Execution] INSERT INTO decks (title) VALUES ($1) RETURNING *
                └── [Return Payload] Created Deck Object { id, title, created_at } -> HTTP 201 Created JSON
```

---

## Session Status & Resume Instructions
Documentation for F-03 Custom Deck Creator 6-tier call stack trace is created and verified.
Proceed to backend implementation of deck routes, controllers, and error handling.
