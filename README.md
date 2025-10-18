# My Local API (improved)

This branch migrates the project to TypeScript, persists data in SQLite, adds request validation, rate limiting, OpenAPI docs, tests, and graceful shutdown.

Quick start (development)
1. Install
   npm install

2. Run in development
   npm run dev

3. Run tests
   npm test

Docs are available at /docs when the server is running.

Notes:
- SQLite DB file is located at ./data/db.sqlite by default (or override with SQLITE_FILE env var).
- Tests use an ephemeral sqlite test file created under ./data.
