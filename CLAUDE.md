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

**Frontend:**
- React + Vite (TypeScript)
- React Router (routing)
- TanStack Query (data fetching)
- Redux (global state — added when needed)
- React Hook Form + Zod (forms & validation)
- SCSS + CSS Modules (styling)
- MUI (UI component library)
- Axios (HTTP client)

## Development Commands

Commands for `backend/`:

```bash
npm install       # Install dependencies
npm run dev       # Start server with nodemon
```

Commands for `frontend/`:

```bash
npm install       # Install dependencies
npm run dev       # Start Vite dev server
npm run build     # Production build
npm run lint      # Run ESLint
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

## Frontend Architecture

Full decisions and rationale are in [`docs/frontend_structure.md`](docs/frontend_structure.md).

### Folder Structure

```
frontend/src/
├── assets/images/{icons,logos}/
├── modules/                        # Feature pages (auth, vehicles, profile, dashboard)
│   └── {feature}/
│       ├── components/
│       ├── hooks/                  # TanStack Query hooks (useMutation / useQuery)
│       └── schemas/                # Zod schemas scoped to this module
├── layout/
│   ├── PublicLayout.tsx            # Navbar + footer (landing/explore)
│   └── DashboardLayout.tsx         # Sidebar (profile/my listings)
├── api/
│   ├── helpers/
│   │   ├── axiosClient.ts
│   │   └── apiPath.ts
│   └── services/                   # Pure async Axios wrappers (no React)
│       ├── authService.ts
│       ├── vehicleService.ts
│       └── profileService.ts
├── hooks/                          # Global hooks (useAuth, useDebounce)
├── routes/routes.tsx
├── types/
├── utils/
│   ├── common-utils.ts
│   └── validators/zod/             # Shared Zod primitives (email, phone, price)
├── widgets/                        # Reusable MUI wrappers — presentational only
├── shared-components/              # Domain-specific reusables (VehicleCard, FilterBar)
├── store/slices/                   # Redux slices
├── theme/theme.ts                  # MUI createTheme
├── styles/
│   ├── _variables.scss
│   └── global.scss
└── constants/messages/messages-fe.json
```

### Layer Rules

- **Modules:** Compose layout, call hooks/services, render widgets. No direct Axios calls.
- **`api/services/`:** Pure async functions — no React, no TanStack Query. One file per feature.
- **Module hooks:** Wrap service calls with `useMutation`/`useQuery`; own caching and `onSuccess` logic.
- **Widgets:** MUI wrappers — presentational only, no API calls.
- **`shared-components/`:** Domain-specific reusables — may call API services.

**Data flow:** `Component → module hook (TanStack) → api/service (Axios) → backend`

### Locality Rules

- Hooks, schemas, and SCSS start **local to the module**; promote to a shared location only when a second module actually needs them.
- Shared Zod primitives (email, phone, price) live in `utils/validators/zod/`.
- Component styles use `.module.scss` (CSS Modules) to prevent class-name bleed.
- `styles/` is reserved for global tokens and resets only.

## Code Style Guidelines

- Always follow coding best practices
- Write concise comments for each code section
- Run npm run lint after making changes