# Phase 4 Execution Trace & Architecture Plan: F-02 Timer, Reveal Modal & Results Dashboard

## Executive Summary
This document details the 6-tier call stack trace for Feature Slices F-02a, F-02b, and F-02c, tracing the "answer -> modal -> next question -> results" path across the Tandem web application.

---

## 6-Tier Call Stack Diagram: Answer -> RevealCard Modal -> Next Question -> Results Dashboard

```
Execution Call Stack Trace: User Answers Question -> RevealCard Modal -> Next Question Loop -> Results Dashboard
└── [Project] Tandem Fullstack Web App (Browser Client <-> Express Server API)
    ├── [Configuration/Env] PORT=3000, NODE_ENV=development, PGHOST=localhost, PGDATABASE=tandem
    └── [Folder] client/src/
        └── [File] client/src/pages/PlayPage.jsx
            └── [Component] PlayPage
                ├── [Method] handleOptionSelect(option = "Letter") / handleTimeout()
                │   ├── [Folder] client/src/hooks/
                │   │   └── [File] client/src/hooks/useTimer.js
                │   │       └── [Method] stopTimer()
                │   │           └── [Variable State Shift] Timer Stopped immediately at timeLeft = X
                │   ├── [Variable State Shift] Answer Evaluated: isCorrect = true, score = score + 1
                │   ├── [Variable State Shift] Round State Mutated: roundWords = [...roundWords, wordData], showRevealModal = true
                │   └── [Folder] client/src/components/
                │       └── [File] client/src/components/RevealCard.jsx
                │           └── [Component] RevealCard
                │               ├── [Variable State Shift] Modal Rendered: Backdrop overlays page blocking pointer-events
                │               ├── [Variable State Shift] Relationship Tag Badge Rendered: class "relationship-tag false_friend" (Red "✗ False Friend")
                │               └── [Method] handleNextQuestion()
                │                   ├── [Variable State Shift] Modal Dismissed: showRevealModal = false
                │                   ├── [Branch Decision] IF roundWords.length < 10 THEN
                │                   │   └── [Method] loadRandomWord()
                │                   │       ├── [Folder] client/src/services/
                │                   │       │   └── [File] client/src/services/api.js
                │                   │       │       └── [Method] getRandomWord("cn_to_jp")
                │                   │       │           └── [Project] Network Hop: GET /api/words/random?direction=cn_to_jp
                │                   │       └── [Method] startTimer(10)
                │                   └── [Branch Decision] ELSE (roundWords.length === 10)
                │                       └── [Method] navigate('/results', { state: { roundWords, score } })
                └── [File] client/src/pages/ResultsPage.jsx
                    └── [Component] ResultsPage
                        ├── [Variable State Shift] Route Loaded: /results
                        ├── [Variable State Shift] Calculation: trueCount = roundWords.filter(w => w.relationship_tag === 'true_friend').length
                        ├── [Variable State Shift] Calculation: similarityPct = (trueCount / 10) * 100, scorePct = (score / 10) * 100
                        └── [Method] Render UI
                            ├── [Variable State Shift] Progress Bar: .similarity-meter style="width: X%"
                            └── [Method] Play Again Button onClick -> navigate('/play')
```

---

## Session Status & Resume Instructions
All Feature Slices F-02a (10-Second Timer), F-02b (RevealCard Modal), and F-02c (10-Question Round & Results Dashboard with Similarity Meter) are fully implemented and verified.
It is safe to start a fresh Jules session or proceed to the next feature slice.
