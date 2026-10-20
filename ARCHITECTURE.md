# ARCHITECTURE.md — Tandem System Architecture

## Overview
Tandem is a fullstack web application built using standard Web103 capstone architecture: a React frontend (`client/`), an Express/Node.js REST backend (`server/`), and a PostgreSQL database.

---

## 1. Database Entity-Relationship Diagram (ERD)

The system relies on 7 PostgreSQL tables with exact foreign key relationships, unique constraints, and check constraints as specified in the schema requirements.

```mermaid
erDiagram
    users ||--o| user_profiles : "has"
    users ||--o{ decks : "creates"
    users ||--o{ missed_words : "tracks"
    users ||--o{ scores : "records"
    words ||--o{ deck_words : "belongs_to"
    words ||--o{ missed_words : "logged_in"
    decks ||--o{ deck_words : "contains"

    users {
        SERIAL id PK
        TEXT github_id UK "NOT NULL"
        TEXT username "NOT NULL"
        TEXT avatar_url
        TIMESTAMPTZ created_at "DEFAULT NOW()"
    }

    user_profiles {
        SERIAL id PK
        INTEGER user_id FK,UK "REFERENCES users(id) ON DELETE CASCADE"
        INTEGER total_rounds_played "DEFAULT 0"
        INTEGER best_score_cn_jp "DEFAULT 0"
        INTEGER best_score_jp_cn "DEFAULT 0"
    }

    words {
        SERIAL id PK
        TEXT characters "NOT NULL"
        TEXT chinese_reading "NOT NULL"
        TEXT japanese_reading "NOT NULL"
        TEXT chinese_meaning "NOT NULL"
        TEXT japanese_meaning "NOT NULL"
        TEXT relationship_tag "CHECK IN ('true_friend','false_friend','half_friend')"
    }

    decks {
        SERIAL id PK
        INTEGER user_id FK "REFERENCES users(id) ON DELETE CASCADE"
        TEXT title "NOT NULL"
        TIMESTAMPTZ created_at "DEFAULT NOW()"
    }

    deck_words {
        SERIAL id PK
        INTEGER deck_id FK "REFERENCES decks(id) ON DELETE CASCADE"
        INTEGER word_id FK "REFERENCES words(id) ON DELETE CASCADE"
        INTEGER position "DEFAULT 0"
        UNIQUE deck_id_word_id "UNIQUE(deck_id, word_id)"
    }

    missed_words {
        SERIAL id PK
        INTEGER user_id FK "REFERENCES users(id) ON DELETE CASCADE"
        INTEGER word_id FK "REFERENCES words(id) ON DELETE CASCADE"
        INTEGER miss_count "DEFAULT 1"
        TIMESTAMPTZ last_missed_at "DEFAULT NOW()"
        UNIQUE user_id_word_id "UNIQUE(user_id, word_id)"
    }

    scores {
        SERIAL id PK
        INTEGER user_id FK "REFERENCES users(id) ON DELETE CASCADE"
        TEXT direction "CHECK IN ('cn_to_jp','jp_to_cn')"
        INTEGER score "NOT NULL"
        INTEGER similarity_pct "NOT NULL"
        TIMESTAMPTZ played_at "DEFAULT NOW()"
    }
```

---

## 2. Component Diagram

```mermaid
graph TD
    subgraph Client [React Frontend - client/src]
        HomePage[HomePage.jsx]
        QuizPage[QuizPage.jsx]
        SummaryPage[SummaryPage.jsx]
        ProfilePage[ProfilePage.jsx]
        DeckDashboard[DeckDashboard.jsx]
        LeaderboardPage[LeaderboardPage.jsx]
        ApiService[services/api.js]

        HomePage --> ApiService
        QuizPage --> ApiService
        SummaryPage --> ApiService
        ProfilePage --> ApiService
        DeckDashboard --> ApiService
        LeaderboardPage --> ApiService
    end

    subgraph Server [Express Backend - server/]
        AuthRoutes[/auth -> routes/auth.js]
        WordRoutes[/api/words -> routes/words.js]
        DeckRoutes[/api/decks -> routes/decks.js]
        ScoreRoutes[/api/scores -> routes/scores.js]
        ProfileRoutes[/api/profile -> routes/profile.js]
        MissedWordRoutes[/api/missed-words -> routes/missedWords.js]
        LeaderboardRoutes[/api/leaderboards -> routes/leaderboard.js]
    end

    subgraph Database [PostgreSQL Database]
        UsersTable[(users)]
        UserProfilesTable[(user_profiles)]
        WordsTable[(words)]
        DecksTable[(decks)]
        DeckWordsTable[(deck_words)]
        MissedWordsTable[(missed_words)]
        ScoresTable[(scores)]
    end

    ApiService -->|HTTP REST| AuthRoutes
    ApiService -->|HTTP REST| WordRoutes
    ApiService -->|HTTP REST| DeckRoutes
    ApiService -->|HTTP REST| ScoreRoutes
    ApiService -->|HTTP REST| ProfileRoutes
    ApiService -->|HTTP REST| MissedWordRoutes
    ApiService -->|HTTP REST| LeaderboardRoutes

    AuthRoutes --> UsersTable
    AuthRoutes --> UserProfilesTable
    WordRoutes --> WordsTable
    DeckRoutes --> DecksTable
    DeckRoutes --> DeckWordsTable
    ScoreRoutes --> ScoresTable
    ScoreRoutes --> UserProfilesTable
    ProfileRoutes --> UserProfilesTable
    ProfileRoutes --> MissedWordsTable
    MissedWordRoutes --> MissedWordsTable
    LeaderboardRoutes --> ScoresTable
    LeaderboardRoutes --> UsersTable
```

---

## 3. Architecture Decision Records (ADR)

### ADR-0001: Use Passport.js GitHub OAuth Strategy for User Authentication

- **Context:** Tandem requires authenticated user capabilities (saving custom decks, tracking missed words, recording high scores on direction leaderboards, and maintaining personal user profiles). We need a secure, standardized authentication solution that integrates cleanly with Express and PostgreSQL without storing raw passwords or requiring complex password-reset infrastructure.
- **Decision:** We decide to use Passport.js with `passport-github2` OAuth 2.0 strategy for user authentication.
- **Why:**
  1. **User Experience:** Provides 1-click authentication using existing GitHub credentials.
  2. **Security:** Offloads password storage and credential validation entirely to GitHub, eliminating password storage liabilities in PostgreSQL.
  3. **Seamless Integration:** Standardizes session serialization/deserialization into Express `req.user` and allows straightforward linking to the `users` database table using `github_id`.
  4. **PostgreSQL Match:** On successful OAuth verification, the application queries `users` by `github_id` and upserts a user row along with an initialized row in `user_profiles`.
- **Consequences:**
  - Express server requires session middleware (`express-session`) and cookie configuration.
  - Requires `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET` environment variables.
  - Guest users are allowed to play quiz rounds locally, but API endpoints requiring persistence check for `req.isAuthenticated()`.
