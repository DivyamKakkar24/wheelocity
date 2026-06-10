# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Wheelocity is a used vehicle marketplace (MVP, Phase 0). Users can register, log in, and will eventually list and browse vehicles. The backend is live; the frontend is planned. See `docs/` for full feature specs and roadmap.

## Tech Stack

**Backend:**
- Node.js + Express 5 (CommonJS modules) — note: Express v5 has breaking changes from v4
- MySQL 2 (promise-based, connection pooling via `mysql2/promise`)
- JWT (1-hour expiry) + bcrypt (12 salt rounds) for auth
- CORS, dotenv

**Development:** Nodemon (`npm run dev`)

**Frontend:** Directory exists, not yet initialized.

## Development Commands

All commands run from `backend/`:

```bash
npm install       # Install dependencies
npm run dev       # Start server with nodemon (PORT from .env)
```

No test framework is configured. The server reads `PORT`, `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`, and `JWT_SECRET` from `backend/.env` (not in git).

## Architecture

The backend follows an MVC pattern under `backend/src/`:

```
backend/
├── server.js              # Entry point: loads dotenv, starts Express on process.env.PORT
└── src/
    ├── app.js             # Express app: registers CORS, JSON body parser, routes
    ├── config/db.js       # mysql2/promise pool (max 10 connections)
    ├── routes/authRoutes.js
    ├── controllers/authController.js
    ├── models/userModel.js        # findUserByEmail, getUserById, createUser
    └── middleware/verifyToken.js  # JWT Bearer token verification → req.user
```

### Current Endpoints

**Auth** (`/api/v1/auth`):
- `POST /register` — name, email, password → bcrypt hash → insert user
- `POST /login` — email + password → bcrypt compare → JWT token response
- `POST /logout` — returns success (stateless; no server-side session)

**Health check** (`GET /health`) — protected by `verifyToken`; used to verify the API and a JWT token are working.

### Adding New Routes

1. Create a route file in `src/routes/`, a controller in `src/controllers/`, and a model in `src/models/`.
2. Register the router in `src/app.js` with `app.use("/api/v1/...", routerName)`.
3. Wrap protected endpoints with `verifyToken` middleware.

`src/services/` and `src/utils/` directories exist but are empty — use them for shared business logic and helpers.
