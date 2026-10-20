# Foundation Design Decisions & Execution Plan (Phase 1)

## 1. Executive Summary & Repository Bootstrap
This document captures the foundational architectural decisions, PostgreSQL database schema definitions, ubiquitous language alignment, and 6-tier program design execution trace for the Tandem application as part of Phase 1 of the Elite Engineering SDLC framework.

---

## 2. PostgreSQL Schema Definition
The exact database schema implemented for the PostgreSQL database instance:

```sql
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
```

---

## 3. Architecture Decision Record (ADR)
- **Title:** Use Passport.js GitHub OAuth Strategy for User Authentication
- **Decision:** Use Passport.js with `passport-github2` OAuth 2.0 strategy for user authentication.
- **Context & Rationale:** Tandem requires authenticated capabilities (saving custom decks, tracking missed words, recording high scores on direction leaderboards, and maintaining user profiles). GitHub OAuth provides a secure 1-click login mechanism without raw password management or email verification overhead.
- **Consequences:** Express requires `express-session` and cookie middleware, along with `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET` environment variables.

---

## 4. 6-Tier Call Stack Diagram: "Guest Plays One Quiz Round" Happy Path
Strict 6-tier nested tree call stack mapping:
1. **a) Project Level** (System boundaries)
2. **b) Folder Level** (Layer/domain boundaries)
3. **c) File Level** (Module / configuration / state files)
4. **d) Class / Component Level** (Active structures)
5. **e) Method / Function Level** (Operations & signatures)
6. **f) State Mutability / Variable Level** (Explicit key variable value transitions)

```
Execution Call Stack Trace: Guest Plays One Quiz Round
└── [Project] Tandem Fullstack Web App (Browser client <-> Express server)
    ├── [Configuration/Env] PORT=3000, NODE_ENV=development, QUIZ_LIMIT=10
    └── [Folder] client/src/
        └── [File] client/src/pages/HomePage.jsx
            └── [Component] HomePage
                └── [Method] selectDirectionAndStart(direction: "cn_to_jp")
                    ├── [Variable State Shift] Inbound Param: direction = "cn_to_jp"
                    ├── [Variable State Shift] Navigation State Shift: navigate('/quiz', { state: { direction: 'cn_to_jp', isGuest: true } })
                    └── [Folder] client/src/
                        └── [File] client/src/pages/QuizPage.jsx
                            └── [Component] QuizPage
                                └── [Method] useEffect() / startQuizRound()
                                    ├── [Variable State Shift] Inbound Param: direction = "cn_to_jp", count = 10
                                    └── [Method] fetchQuizWords(direction: "cn_to_jp", limit: 10)
                                        └── [Folder] client/src/services/
                                            └── [File] client/src/services/api.js
                                                └── [Method] getQuizWords(direction = "cn_to_jp", limit = 10)
                                                    └── [Project] HTTP GET /api/words/quiz?direction=cn_to_jp&limit=10
                                                        └── [Folder] server/routes/
                                                            └── [File] server/routes/words.js
                                                                └── [Controller/Router] ExpressRouter
                                                                    └── [Method] handleGetQuizWords(req, res)
                                                                        ├── [Variable State Shift] req.query.direction = "cn_to_jp", req.query.limit = "10"
                                                                        └── [Folder] server/controllers/
                                                                            └── [File] server/controllers/wordsController.js
                                                                                └── [Class/Module] WordsController
                                                                                    └── [Method] getQuizWordsFromDB(direction = "cn_to_jp", limit = 10)
                                                                                        ├── [Variable State Shift] Query Param: SQL = "SELECT * FROM words ORDER BY RANDOM() LIMIT $1"
                                                                                        └── [Project] PostgreSQL Database Query Executed
                                                                                            ├── [Variable State Shift] DB Result: 10 word rows returned
                                                                                            └── [Project] HTTP Response 200 OK Json Payload returned to Client
                                    ├── [Variable State Shift] Client State Mutated: quizState = { words: [10 items], currentIndex: 0, score: 0, trueFriendsCount: 0, answers: [] }
                                    └── [Method] renderActiveQuestion()
                                        └── [Folder] client/src/components/
                                            └── [File] client/src/components/WordCard.jsx
                                                └── [Component] WordCard
                                                    └── [Method] handleOptionSelect(selectedOption: "Letter")
                                                        ├── [Variable State Shift] Timer State Shift: clearInterval(timerId) (stopped at 4s)
                                                        ├── [Variable State Shift] Option Selected: isCorrect = true (for target word "手紙")
                                                        ├── [Variable State Shift] Quiz State Shift: score = score + 1 (0 -> 1), trueFriendsCount = trueFriendsCount + 1 (if relationship_tag === 'true_friend')
                                                        └── [Folder] client/src/components/
                                                            └── [File] client/src/components/RevealCard.jsx
                                                                └── [Component] RevealCard
                                                                    └── [Method] renderModal(wordData, userChoice)
                                                                        ├── [Variable State Shift] Display State: showModal = true
                                                                        ├── [Variable State Shift] Character Display: "手紙"
                                                                        ├── [Variable State Shift] Readings: CN "shǒuzhǐ", JP "tegami"
                                                                        ├── [Variable State Shift] Meanings: CN "Toilet paper", JP "Letter"
                                                                        ├── [Variable State Shift] Relationship Tag: "false_friend"
                                                                        └── [Method] handleNextQuestion()
                                                                            ├── [Variable State Shift] Quiz State Shift: currentIndex = currentIndex + 1 (0 -> 1 ... -> 10)
                                                                            └── [Method] onQuizComplete() [Triggered when currentIndex === 10]
                                                                                ├── [Variable State Shift] Final Metric Calculation: similarity_pct = Math.round((trueFriendsCount / 10) * 100)
                                                                                ├── [Variable State Shift] Guest Check: isGuest === true -> Skip DB POST /api/scores
                                                                                └── [Folder] client/src/pages/
                                                                                    └── [File] client/src/pages/SummaryPage.jsx
                                                                                        └── [Component] SummaryPage
                                                                                            └── [Method] renderSummary()
                                                                                                └── [Folder] client/src/components/
                                                                                                    └── [File] client/src/components/SimilarityMeter.jsx
                                                                                                        └── [Component] SimilarityMeter
                                                                                                            └── [Method] renderMeter(similarity_pct)
                                                                                                                └── [Variable State Shift] UI Render: Progress bar rendered at similarity_pct %
```

---

## 5. Canonical Directory Skeleton
- `server/` -> `index.js`, `config/reset.js`, `routes/`, `controllers/`
- `client/src/` -> `pages/`, `components/`, `services/api.js`
- `docs/plans/` -> `p0-foundation.md` (this file)
- `docs/adr/` -> `0001-github-oauth.md`
