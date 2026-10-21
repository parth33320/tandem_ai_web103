# P4 Deliverable: GitHub OAuth, Missed Words Tracking, Toast Notifications & Button Audit

## Summary of What Was Built

In this P4 repair session, the following deliverables were implemented end-to-end:

1. **GitHub OAuth (Passport.js)**
   - Installed `passport`, `passport-github2`, `express-session`, and `connect-pg-simple` on the server.
   - Configured `passport-github2` `GitHubStrategy` in `server/config/passport.js` to upsert user records in `users` and initialize `user_profiles`.
   - Created `server/middleware/requireAuth.js` returning 401 JSON when unauthenticated.
   - Implemented authentication endpoints in `server/routes/auth.js` (`GET /auth/github`, `GET /auth/github/callback`, `GET /auth/logout`, `GET /api/me`, `POST /auth/mock-login`).
   - Configured `connect-pg-simple` session store and passport middleware in `server/index.js`.
   - Protected deck mutation routes (`POST /api/decks`, `DELETE /api/decks/:id`, `PATCH /api/decks/:id`) with `requireAuth`.
   - Created `client/src/hooks/useAuth.js` to fetch `/api/me` on mount.
   - Created `client/src/components/NavBar.jsx` displaying Login with GitHub or User Avatar/Username/Logout based on auth state, and passed user state from `App.jsx`.

2. **Missed Words Route & UI**
   - Created `server/controllers/missedWords.js` and `server/routes/missedWords.js` with `POST /api/missed-words` (upserting miss count and timestamp) and `GET /api/missed-words` (returning missed words ordered by `miss_count DESC`).
   - Wired missed words routes in `server/index.js`.
   - Added `getMissedWords()` and `addMissedWord()` in `client/src/services/api.js`.
   - Updated `RevealCard.jsx` and `PlayPage.jsx` to post incorrect answers to `POST /api/missed-words` when the user is logged in.
   - Updated `ProfilePage.jsx` to render the user card and missed words list with `miss_count` badges.

3. **React Hot Toast**
   - Installed `react-hot-toast` in `client/`.
   - Added `<Toaster position="top-right" />` in `client/src/main.jsx`.
   - Added toast triggers for deck creation, updating, deletion, score saving, and login requirements.

4. **Button Disable Audit**
   - Audited and verified async submit buttons are disabled while in-flight:
     - `DeckForm` submit button (`disabled={isSubmitting}`)
     - `DeckList` delete button (`disabled={deletingDeckId === deck.id}`) and save button (`disabled={isSubmitting}`)
     - `DeckDetailPage` add/remove word buttons (`disabled` during async submit)
     - `ResultsPage` play/score save button (`disabled={savingScore}`)
     - `NavBar` logout link (`disabled` state while logging out)

5. **Playwright Tests**
   - Created `tests/f04.spec.js` asserting unauthenticated 401 status on `/api/missed-words` and `/api/decks`, `/api/me` session behavior, mock login flow, and UI login anchor presence.
   - All 18 tests across all test suites pass.

---

## 6-Tier Call Stack Diagram for `POST /api/missed-words`

```
Project(tandem)
└── server/routes/missedWords.js
    └── requireAuth middleware
        └── missedWordsController.upsertMissedWord(req, res)
            └── db.query("INSERT INTO missed_words (user_id, word_id, miss_count, last_missed_at) VALUES ($1, $2, 1, NOW()) ON CONFLICT (user_id, word_id) DO UPDATE SET miss_count = missed_words.miss_count + 1, last_missed_at = NOW() RETURNING *")
                └── row: { user_id, word_id, miss_count+1, last_missed_at=NOW() }
```

---

## Files Changed

- `server/package.json`
- `server/package-lock.json`
- `server/config/passport.js`
- `server/middleware/requireAuth.js`
- `server/routes/auth.js`
- `server/routes/decks.js`
- `server/controllers/missedWords.js`
- `server/routes/missedWords.js`
- `server/index.js`
- `client/package.json`
- `client/package-lock.json`
- `client/src/main.jsx`
- `client/src/App.jsx`
- `client/src/hooks/useAuth.js`
- `client/src/components/NavBar.jsx`
- `client/src/components/RevealCard.jsx`
- `client/src/components/DeckForm.jsx`
- `client/src/components/DeckList.jsx`
- `client/src/services/api.js`
- `client/src/pages/DecksPage.jsx`
- `client/src/pages/DeckDetailPage.jsx`
- `client/src/pages/PlayPage.jsx`
- `client/src/pages/ResultsPage.jsx`
- `client/src/pages/ProfilePage.jsx`
- `tests/f03.spec.js`
- `tests/f04.spec.js`
- `docs/plans/p4-auth-missed-words.md`

---

## Remaining TODOs

- None. All P4 deliverable requirements and tests are complete.

---

P4-Retry complete. Start a new Jules session for P8.
