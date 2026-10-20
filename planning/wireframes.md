# Wireframes

Below is the list of pages in the Tandem web application. Pages marked with a ⭐ include an ASCII wireframe diagram (~20 lines each).

## List of Pages

1. Home / Game Direction Selector ⭐
2. Play Page (quiz card + timer bar + 4 answer buttons) ⭐
3. Results (similarity meter + score + play again) ⭐
4. Leaderboard (toggle + ranked table) ⭐
5. Deck Creator Dashboard ⭐

---

## Wireframe 1: Home / Game Direction Selector ⭐

```text
+-----------------------------------------------------------------------+
|  TANDEM                                     [ Leaderboards | Profile ]|
+-----------------------------------------------------------------------+
|                                                                       |
|                     WELCOME TO TANDEM KANJI QUIZ                      |
|          Test your knowledge of Kanji & Hanzi word relationships      |
|                                                                       |
|   +---------------------------------------------------------------+   |
|   |                  SELECT GAME DIRECTION                        |   |
|   |                                                               |   |
|   |  [  Chinese -> Guess Japanese Meaning  (cn_to_jp)          ]  |   |
|   |                                                               |   |
|   |  [  Japanese -> Guess Chinese Meaning  (jp_to_cn)          ]  |   |
|   +---------------------------------------------------------------+   |
|                                                                       |
|   Round Settings: 10 Questions | Timer: 10 Seconds / Question         |
|                                                                       |
|   [                      START QUIZ ROUND                          ]  |
|                                                                       |
+-----------------------------------------------------------------------+
```

---

## Wireframe 2: Play Page (Quiz Card + Timer Bar + 4 Answer Buttons) ⭐

```text
+-----------------------------------------------------------------------+
|  TANDEM (Question 3 / 10)                        Direction: CN -> JP  |
+-----------------------------------------------------------------------+
|  Time Remaining: [==============..........] 6.5s                      |
+-----------------------------------------------------------------------+
|                                                                       |
|   +---------------------------------------------------------------+   |
|   |                                                               |   |
|   |                            手紙                               |   |
|   |                      Chinese Reading: shǒuzhǐ                 |   |
|   |                      What is the Japanese meaning?            |   |
|   |                                                               |   |
|   +---------------------------------------------------------------+   |
|                                                                       |
|   +-------------------------------+   +---------------------------+   |
|   |  A) Toilet Paper              |   |  B) Written Letter        |   |
|   +-------------------------------+   +---------------------------+   |
|   +-------------------------------+   +---------------------------+   |
|   |  C) Envelope                  |   |  D) Newspaper             |   |
|   +-------------------------------+   +---------------------------+   |
|                                                                       |
+-----------------------------------------------------------------------+
```

---

## Wireframe 3: Results (Similarity Meter + Score + Play Again) ⭐

```text
+-----------------------------------------------------------------------+
|  TANDEM                                                       RESULTS |
+-----------------------------------------------------------------------+
|                                                                       |
|                        QUIZ ROUND COMPLETED!                          |
|                             Score: 8 / 10                             |
|                                                                       |
|   +---------------------------------------------------------------+   |
|   |                  FALSE FRIEND SIMILARITY METER                |   |
|   |                                                               |   |
|   |   [========================...................] 40%           |   |
|   |   4 out of 10 words in this round share identical meanings.   |   |
|   +---------------------------------------------------------------+   |
|                                                                       |
|   Round Summary breakdown:                                            |
|   - True Friends: 4  |  Half Friends: 3  |  False Friends: 3          |
|                                                                       |
|   [  PLAY ANOTHER ROUND  ]               [  VIEW LEADERBOARDS  ]     |
|                                                                       |
+-----------------------------------------------------------------------+
```

---

## Wireframe 4: Leaderboard (Toggle + Ranked Table) ⭐

```text
+-----------------------------------------------------------------------+
|  TANDEM                                                  LEADERBOARDS |
+-----------------------------------------------------------------------+
|                                                                       |
|   Direction Toggle: [ Chinese -> Japanese | (Switch to JP -> CN) ]    |
|                                                                       |
|   +------+----------------------+------------+--------------------+   |
|   | Rank | User                 | High Score | True Friend Match  |   |
|   +------+----------------------+------------+--------------------+   |
|   |  1   | @kanji_master        | 10 / 10    | 80%                |   |
|   |  2   | @tasneem_s           |  9 / 10    | 60%                |   |
|   |  3   | @robert_c            |  8 / 10    | 50%                |   |
|   |  4   | @parth_p             |  8 / 10    | 40%                |   |
|   |  5   | @hunter_s            |  7 / 10    | 30%                |   |
|   +------+----------------------+------------+--------------------+   |
|                                                                       |
|   [  BACK TO HOME  ]                         [  VIEW MY PROFILE  ]    |
|                                                                       |
+-----------------------------------------------------------------------+
```

---

## Wireframe 5: Deck Creator Dashboard ⭐

```text
+-----------------------------------------------------------------------+
|  TANDEM                                               DECK DASHBOARD  |
+-----------------------------------------------------------------------+
|                                                                       |
|   +---------------------------------------------------------------+   |
|   | Create New Deck: [ Enter deck title... ]   [ + Create Deck ]  |   |
|   +---------------------------------------------------------------+   |
|                                                                       |
|   Your Custom Decks:                                                  |
|   +---------------------------------------------------------------+   |
|   |  JLPT N3 False Friends (15 Words)             [Edit]  [Delete]|   |
|   |  "Collection of tricky characters with shifted meanings"      |   |
|   +---------------------------------------------------------------+   |
|   |  Starter Deck (10 Words)                      [Edit]  [Delete]|   |
|   |  "Default word set for beginner practice"                     |   |
|   +---------------------------------------------------------------+   |
|                                                                       |
|   [ + Add New Word To Active Deck ]                                   |
|                                                                       |
+-----------------------------------------------------------------------+
```
