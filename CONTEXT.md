# CONTEXT.md — Ubiquitous Language Glossary for Tandem

This glossary establishes the ubiquitous domain language for Tandem. Every domain noun from the feature set is defined below with its exact meaning and system location to maintain consistent naming across client components, server controllers, API routes, database schema, and documentation.

## Domain Glossary

| Term | Definition | Where Used |
| --- | --- | --- |
| **QuizRound** | A timed 10-question gameplay session where a player answers word questions within a strict countdown per question in a specified game direction. | `client/src/pages/QuizPage.jsx`, `server/routes/scores.js`, `scores` DB table |
| **WordCard** | An interactive flashcard component displayed during an active quiz question showing target character(s) and candidate translation options. | `client/src/components/WordCard.jsx`, `words` DB table |
| **RevealCard** | A modal card shown after an answer is submitted displaying side-by-side Chinese and Japanese readings, meanings, and the relationship tag. | `client/src/components/RevealCard.jsx`, `words` DB table |
| **SimilarityMeter** | A round summary metric and progress bar component displaying the calculated percentage of words in a completed round tagged as `true_friend`. | `client/src/components/SimilarityMeter.jsx`, `client/src/pages/SummaryPage.jsx`, `scores` DB table |
| **MissedWord** | A record tracking a word incorrectly answered by a logged-in user, incrementing its miss count and timestamp for personal review. | `client/src/pages/ProfilePage.jsx`, `server/routes/missedWords.js`, `missed_words` DB table |
| **Deck** | A user-created or default collection of words grouped for custom quiz practice. | `client/src/pages/DeckDashboard.jsx`, `server/routes/decks.js`, `decks` & `deck_words` DB tables |
| **GameDirection** | The translation orientation chosen for a quiz round: Chinese-to-Japanese (`cn_to_jp`) or Japanese-to-Chinese (`jp_to_cn`). | `client/src/pages/HomePage.jsx`, `server/routes/scores.js`, `scores` DB table (`direction` column) |
| **RelationshipTag** | A linguistic classification tag categorizing character overlap: `true_friend` (same characters & meaning), `false_friend` (same characters, different meaning), or `half_friend` (related/shifted meaning). | `client/src/components/RevealCard.jsx`, `words` DB table (`relationship_tag` column) |
| **LeaderboardEntry** | A ranked score record for a user in a specific game direction, displayed on split direction leaderboards. | `client/src/pages/LeaderboardPage.jsx`, `server/routes/leaderboard.js`, `user_profiles` & `scores` DB tables |
| **UserProfile** | An entity linked 1-to-1 with an authenticated user tracking cumulative statistics such as total rounds played and best direction scores. | `client/src/pages/ProfilePage.jsx`, `server/routes/profile.js`, `user_profiles` DB table |
