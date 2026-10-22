# ADR 003: Local PostgreSQL Data Strategy for Passive Lifeline Power-Ups

## Context
Tandem includes "Who Wants to Be a Millionaire"-style lifelines (`Fifty_Fifty`, `Hint_Provider`, `Expert_Advice`).

## Decision
We chose local client-side algorithms and pre-seeded PostgreSQL database text columns (`jp_meaning_note`, `zh_meaning_note`) rather than external cloud LLM APIs (OpenAI/Claude).

## Consequences
- **Pros:**
  - Fast execution time with zero API network latency.
  - Zero external API costs or dependency risks during grading / offline testing.
  - High accuracy and predictable hints stored directly with word data.
- **Cons:**
  - Requires pre-seeded notes in database schema for hint generation.
