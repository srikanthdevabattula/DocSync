# CollabDocs

Production-ready monorepo scaffold for a **Local-First Collaborative Document Editor**.

This repository contains the project architecture only — no business features have been implemented yet.

## Tech Stack

| Layer    | Technologies |
| -------- | ------------ |
| Frontend | Next.js 16, React 19, TypeScript, Tailwind CSS, Redux Toolkit, React Hook Form, Zod, TipTap, Axios |
| Backend  | Node.js, Express 5, TypeScript, MongoDB, Mongoose, JWT, Zod, Winston |

## Project Structure

```
edtech/
├── client/          # Next.js frontend (App Router)
├── server/          # Express REST API
├── .env.example     # Environment variable reference
├── .gitignore
└── README.md
```

## Prerequisites

- Node.js 20.9+
- npm 10+
- MongoDB 6+ (local or Atlas)

## Getting Started

### 1. Clone and install

```bash
# Install frontend dependencies
cd client
npm install

# Install backend dependencies
cd ../server
npm install
```

### 2. Configure environment

```bash
# From project root — copy env templates
cp .env.example client/.env.local   # adjust client vars
cp .env.example server/.env         # adjust server vars (MONGODB_URI, JWT secrets)
```

### 3. Run development servers

Open two terminals:

```bash
# Terminal 1 — Frontend (http://localhost:3000)
cd client
npm run dev

# Terminal 2 — Backend (http://localhost:5000)
cd server
npm run dev
```

### 4. Verify setup

- Frontend: http://localhost:3000
- Health check: http://localhost:5000/api/v1/health

## Available Scripts

### Client (`client/`)

| Script            | Description              |
| ----------------- | ------------------------ |
| `npm run dev`     | Start Next.js dev server |
| `npm run build`   | Production build         |
| `npm run start`   | Start production server  |
| `npm run lint`    | Run ESLint               |
| `npm run format`  | Format with Prettier     |
| `npm run typecheck` | TypeScript check       |

### Server (`server/`)

| Script            | Description                    |
| ----------------- | ------------------------------ |
| `npm run dev`     | Start Express with hot reload  |
| `npm run build`   | Compile TypeScript to `dist/`  |
| `npm run start`   | Run compiled production server |
| `npm run lint`    | Run ESLint                     |
| `npm run format`  | Format with Prettier           |
| `npm run typecheck` | TypeScript check             |

## Architecture Overview

### Frontend (`client/`)

- **App Router** — Next.js 16 file-based routing under `app/`
- **Feature-based** — Domain logic lives in `features/`; shared UI in `components/`
- **Redux Toolkit** — Global state via `redux/` with typed hooks
- **Service layer** — Axios client in `services/` with auth interceptors
- **Validation** — Zod schemas in `lib/env.ts` and per-feature validators
- **Absolute imports** — `@/*` path alias configured in `tsconfig.json`

### Backend (`server/`)

- **Modular REST API** — Routes → Controllers → Services → Models
- **Middleware pipeline** — Auth, validation (Zod), centralized error handling
- **JWT utilities** — Token generation/verification in `config/jwt.ts`
- **Structured logging** — Winston logger with configurable log levels
- **Environment validation** — Zod-validated config at startup

## Next Steps

1. Implement authentication feature (register, login, refresh tokens)
2. Add document models and CRUD endpoints
3. Integrate TipTap editor with local-first sync layer
4. Add WebSocket/SSE for real-time collaboration

## License

Private — All rights reserved.
