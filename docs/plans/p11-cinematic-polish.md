# Session P11: Cinematic Polish & Final Rubric Sweep

## Overview
This document details the cinematic polish and final rubric sweep for Tandem (WEB103 Capstone). Features added include a 3D card flip animation for `RevealCard`, royalty-free HTML5 sound triggers, Web Speech API voice narration, customizable user avatar colors, presenter/container architecture refactoring, catch-all 404 page, dependency security audits, ADR documentation, and Playwright verification.

## Deliverables Summary

1. **3D Card Flip Animation (`RevealCard.jsx`)**
   - `.card-scene` wrapper with `perspective: 600px`.
   - `.card-inner` container with `transition: transform 0.6s` and `transform-style: preserve-3d`.
   - `.card-front` and `.card-back` with `backface-visibility: hidden`.
   - Card flip toggles `.is-flipped` applying `transform: rotateY(180deg)`.
   - Relationship tag rendered on `.card-back`.

2. **Sound Effects (`client/src/utils/sounds.js`)**
   - Audio triggers using `new Audio(src).play()` with mute toggle check (`localStorage.getItem('muted') === 'true'`).
   - Sounds for card flip, correct answer, wrong answer, timer warning (3s), weapon fired, and lifeline activation.

3. **Web Speech API Voice Host (`client/src/utils/voiceHost.js`)**
   - `speak(text, lang)` function using `window.speechSynthesis`.
   - Auto-reads Chinese or Japanese characters in `QuestionCard` upon card load.
   - Auto-reads relationship tag ("True Friend", "False Friend", "Half Friend") on `RevealCard` flip.
   - Silenced instantly when muted via NavBar toggle (`window.speechSynthesis.cancel()`).

4. **Avatar Customization (`ProfilePage.jsx` & `PATCH /api/me/avatar`)**
   - DB columns `avatar_color` (`VARCHAR(7)`, default `#6c63ff`) and `avatar_bg` (`VARCHAR(7)`, default `#21253a`) in `user_profiles`.
   - Backend endpoint `PATCH /api/me/avatar` returning 200 with updated fields.
   - Interactive UI with circular preview and native `<input type="color">` pickers.

5. **Final Rubric Sweep**
   - Disabled states on all submit/action buttons.
   - `<ErrorBoundary>` wrapping `<App />` and local fetch `try/catch` blocks.
   - `<LoadingSpinner />` rendered across all pages during data fetch.
   - Catch-all 404 page (`NotFoundPage.jsx`).
   - `npm audit` zero moderate+ vulnerability fixes.
   - `render.yaml` environment variables with `sync: false`.
   - Updated `README.md` and completed `milestones/milestone5.md` checklist.

6. **Component Architecture Cleanliness**
   - Presenter purity across all components in `client/src/components/`.

## 6-Tier Call Stack Diagram for RevealCard 3D Flip

```
Project(tandem)
└── client/src/pages/PlayPage.jsx → onAnswerSubmit(choiceIndex)
    └── client/src/components/RevealCard.jsx → useEffect([isFlipped])
        └── DOM: .card-inner element
            └── CSS class toggle: add .is-flipped → transform: rotateY(180deg) transition 0.6s
                └── sounds.play('flip') + speak(relationshipTag)
```
