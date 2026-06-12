# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a used-vehicle marketplace full-stack application. The backend is in progress; the frontend is planned.

## Tech Stack

**Backend:**
- Node.js + Express 5 (CommonJS modules)
- MySQL 2 (promise-based, connection pooling via `mysql2/promise`)
- JWT + bcrypt for auth
- CORS, dotenv

**Frontend:** Directory exists, not yet initialized.

## Development Commands

Commands for `backend/`:

```bash
npm install       # Install dependencies
npm run dev       # Start server with nodemon
```

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

### Adding New Routes

1. Create a route file in `src/routes/`, a controller in `src/controllers/`, and a model in `src/models/`.
2. Register the router in `src/app.js` with `app.use("/api/v1/...", routerName)`.
3. Wrap protected endpoints with `verifyToken` middleware.

`src/services/` and `src/utils/` directories exist but are empty — use them for shared business logic and helpers.

## Code Style Guidelines

- Always follow coding best practices
- Write concise comments for each code section
- Run npm run lint after making changes