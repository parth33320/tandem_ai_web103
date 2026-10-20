# Entity Relationship Diagram

Tandem relies on a 7-table PostgreSQL database schema tracking users, profiles, words, decks, join relationships, missed word logs, and directional high scores.

## Database Tables List

1. `users`: Stores user identity and GitHub OAuth credentials.
2. `user_profiles`: Stores 1-to-1 aggregate stats for each user.
3. `words`: Stores target character, readings, meanings, and relationship tags (`true_friend`, `false_friend`, `half_friend`).
4. `decks`: User-created or default word collections.
5. `deck_words`: Join table connecting `decks` and `words` with a unique constraint.
6. `missed_words`: Tracks mistake counts for words per user with a unique constraint.
7. `scores`: Records user quiz round performance and direction metrics.

---

## Entity Relationship Diagram (Mermaid)

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
