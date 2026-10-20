# Phase 3 Tracer Bullet TB-01 Execution Trace & Architecture Plan

## Executive Summary
This document contains the 6-tier call stack trace for Tracer Bullet Slice TB-01 (`GET /api/words/random?direction=cn_to_jp`), establishing mandatory architectural traceability for the Tandem web application.

---

## 6-Tier Call Stack Diagram: `GET /api/words/random?direction=cn_to_jp`

```
Execution Call Stack Trace: Guest Requests Random Quiz Question
└── [Project] Tandem Fullstack Web App (Browser Client <-> Express Server API)
    ├── [Configuration/Env] PORT=3000, NODE_ENV=development, PGHOST=localhost, PGDATABASE=tandem
    └── [Folder] client/src/
        └── [File] client/src/pages/PlayPage.jsx
            └── [Component] PlayPage
                └── [Method] loadRandomWord()
                    ├── [Variable State Shift] Client State: loading = true, error = null, selectedOption = null
                    └── [Folder] client/src/services/
                        └── [File] client/src/services/api.js
                            └── [Method] getRandomWord(direction = "cn_to_jp")
                                └── [Project] Network Hop: HTTP GET /api/words/random?direction=cn_to_jp
                                    └── [Folder] server/
                                        └── [File] server/index.js
                                            └── [Class/Module] ExpressApplication
                                                └── [Method] app.use('/api/words', wordsRouter)
                                                    └── [Folder] server/routes/
                                                        └── [File] server/routes/words.js
                                                            └── [Class/Module] ExpressRouter
                                                                └── [Method] router.get('/random', getRandomWord)
                                                                    └── [Folder] server/controllers/
                                                                        └── [File] server/controllers/wordsController.js
                                                                            └── [Class/Module] WordsController
                                                                                └── [Method] getRandomWord(req, res)
                                                                                    ├── [Variable State Shift] Inbound Query: req.query.direction = "cn_to_jp", isCnToJp = true
                                                                                    ├── [Folder] server/config/
                                                                                        └── [File] server/config/db.js
                                                                                            └── [Class/Module] Pool
                                                                                                └── [Method] pool.query("SELECT * FROM words ORDER BY RANDOM() LIMIT 1")
                                                                                                    └── [Project] PostgreSQL DB Query
                                                                                                        ├── [Variable State Shift] DB Result: targetWord = { id: 1, characters: "手紙", chinese_reading: "shǒuzhǐ", japanese_reading: "tegami", chinese_meaning: "Toilet paper", japanese_meaning: "Letter", relationship_tag: "false_friend" }
                                                                                                        └── [Method] pool.query("SELECT * FROM words WHERE id != $1 ORDER BY RANDOM() LIMIT 3", [1])
                                                                                                            └── [Project] PostgreSQL DB Query
                                                                                                                ├── [Variable State Shift] DB Result: 3 distractors = [{ japanese_meaning: "Study" }, { japanese_meaning: "Steam train" }, { japanese_meaning: "Run" }]
                                                                                                                ├── [Variable State Shift] Response Payload Construction: correctAnswer = "Letter", options = ["Run", "Letter", "Study", "Steam train"]
                                                                                                                └── [Project] HTTP Response 200 OK Json Payload returned to Client
                                    ├── [Variable State Shift] Client State Mutated: wordData = { id: 1, characters: "手紙", correct_answer: "Letter", options: ["Run", "Letter", "Study", "Steam train"] }, loading = false
                                    └── [Folder] client/src/components/
                                        └── [File] client/src/components/QuestionCard.jsx
                                            └── [Component] QuestionCard
                                                └── [Method] handleOptionSelect(option = "Toilet paper")
                                                    ├── [Variable State Shift] Client Interaction: selectedOption = "Toilet paper"
                                                    ├── [Variable State Shift] Option Matching: option !== correct_answer ("Toilet paper" !== "Letter")
                                                    └── [Variable State Shift] UI Class Applied: button.className = "option-button wrong"
```

---

## Session Status & Resume Instructions
All Tracer Bullet Slice TB-01 components, API endpoints, database seeding, Playwright E2E tests, and architectural traces are complete and verified. It is safe to start a fresh Jules session or proceed with Phase 4 / future feature slices.
