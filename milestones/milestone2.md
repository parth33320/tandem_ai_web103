# Milestone 2

This document should be completed and submitted during **Unit 6** of this course. You **must** check off all completed tasks in this document in order to receive credit for your work.

## Checklist

This unit, be sure to complete all tasks listed below. To complete a task, place an `x` between the brackets.

- [x] In `planning/wireframes.md`: add wireframes for at least three pages in your web app.
  - [x] Include a list of pages in your app
- [x] In `planning/entity_relationship_diagram.md`: add the entity relationship diagram you developed for your database.
  - [x] Your entity relationship diagram should include the tables in your database.
- [x] Prepare your three-minute pitch presentation, to be presented during Unit 7 (the next unit).
  - [x] You do **not** need to submit any materials in advance of your pitch.
- [x] In this document, complete all three questions in the **Reflection** section below

## Reflection

### 1. What went well during this unit?

Our team successfully aligned on the core domain concepts for Tandem, clearly defining how Kanji/Hanzi relationship classifications integrate with our database schema. We effectively designed ASCII wireframes for all key pages and established a robust 7-table entity relationship diagram mapping PK/FK connections. Collaboration and documentation proceeded smoothly as we finalized our system architecture specifications.

### 2. What were some challenges your group faced in this unit?

Structuring the database relationships to cleanly separate quiz gameplay metrics from user deck customizability required significant iteration. Specifically, ensuring proper foreign key constraints across join tables like `deck_words` and tracking directional scores separately posed initial complexity. Balancing guest mode state in client storage against logged-in user persistence also presented technical discussions.

### 3. What additional support will you need in upcoming units as you continue to work on your final project?

In upcoming units, guidance on configuring OAuth authentication redirects seamlessly across dev and production environments will be helpful. Assistance with optimizing database query performance for real-time leaderboard aggregation and verifying deployment edge cases on Render will also ensure a smooth final release.
