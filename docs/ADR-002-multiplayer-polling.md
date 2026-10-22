# ADR 002: Short-Polling Architecture for Multiplayer Rooms

## Context
Tandem requires multi-user lobby rooms, realtime chat messages, weapon effects (Mario Kart style), and rank updates across room participants.

## Decision
We chose Express REST endpoints with 3-second short-polling (`setInterval` fetch) over persistent WebSockets (e.g. Socket.io).

## Consequences
- **Pros:**
  - Standard RESTful routes with standard session authentication (`req.session` and Passport.js).
  - Stateless HTTP request handling simplifies deployment on Render free tier.
  - Lower server memory overhead without persistent open TCP socket connections.
- **Cons:**
  - Slight latency up to 3 seconds for room updates.
  - Periodic network requests while in lobby/room.
