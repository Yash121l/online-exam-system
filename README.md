# AegisExam

Next-generation online examination and proctoring platform built as a TypeScript monorepo with discrete backend, frontend, and secure Electron client applications.

## Vision
- High-assurance exam delivery with AI-assisted proctoring for Higher Ed, K-12, and Corporate assessments.
- Secure, locked-down student experience paired with a modern management portal.
- Data-rich reporting on performance, exam health, and proctoring signals.

## Repository Layout
- `backend/` – NestJS API + WebSockets, structured logging, S3 utilities, sample grading logic, and tests.
- `frontend/` – Next.js portal for administrators/teachers/evaluators with client-to-backend logging.
- `electron-app/` – Electron secure client that loads the Next.js UI, locks down shortcuts, and forwards security logs (with offline queueing).
- `docker-compose.yml` – Local Postgres and LocalStack (S3) for development.
- `tsconfig.base.json` – Shared TypeScript defaults for the workspace.
- `.env.example` in each app to bootstrap environment variables.

## Technology Stack
- Backend: NestJS 10, Pino logging, Helmet, Throttler, WebSockets.
- Frontend: Next.js 14 (React 18) with typed client logging hooks.
- Secure Client: Electron 27 with preload isolation and IPC-based logging to backend.
- Data Plane: PostgreSQL, AWS S3 (LocalStack for local development).

## Prerequisites
- Node.js 20+
- npm 9+ (workspaces enabled) or pnpm/yarn if preferred
- Docker (for Postgres/LocalStack via `docker-compose`)

## Installation
Install dependencies per app (no root-level package.json/node_modules):
```bash
cd backend && npm install
cd ../frontend && npm install
cd ../electron-app && npm install
```

## Environment Configuration
Create `.env` files in each app (or export vars).

### Backend (`backend/.env`)
```
PORT=3001
DATABASE_URL=postgresql://aegis_exam:aegis_exam_password@localhost:5432/aegis_exam
# Or point to your existing Postgres:
# DATABASE_URL=postgresql://user:password@rishiverse-prod.cbsc0ww245h6.ap-south-1.rds.amazonaws.com:5432/proctor
AWS_REGION=ap-south-1
AWS_BUCKET_NAME=aegisexam-local
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
S3_ENDPOINT=http://localhost:4566
LOG_LEVEL=info
CORS_ORIGINS=http://localhost:3000
JWT_SECRET=change_me
```

### Frontend (`frontend/.env.local`)
```
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001/api
NEXT_PUBLIC_WS_URL=ws://localhost:3001/proctoring
```

### Electron (`electron-app/.env`)
```
AEGISEXAM_API_URL=http://localhost:3001/api
AEGISEXAM_FRONTEND_URL=http://localhost:3000
```

## Running Locally
1. **Start infrastructure (optional when using remote DB/S3)**
   ```bash
   docker-compose up -d
   ```
   Skip this if you already have Postgres/S3 endpoints and point `DATABASE_URL`/`S3_ENDPOINT` to them.
2. **Backend (NestJS)**
   ```bash
   cd backend
   npm run prisma:generate
   npm run prisma:migrate -- --name init   # ensure DATABASE_URL points to your target DB
   npm run start:dev
   ```
   - Global Helmet + CORS
   - Rate limiting via `ThrottlerGuard`
   - Structured logs (Pino) and centralized HTTP exception filter
   - Prisma ORM with Postgres; schema includes Users, Exams, Questions, Sessions, Attempts, Request/Socket logs, Proctoring events
3. **Frontend (Next.js)** – served on port 3000 by default
   ```bash
   cd frontend
   npm run dev
   ```
4. **Electron secure client**
   ```bash
   cd electron-app
   npm run dev
   ```
   - Kiosk/fullscreen window loading the Next UI
   - Shortcut blocking/logging and IPC-based client logging (`window.aegisExam.log`)
   - Offline log queue flushed periodically or via `flushOffline`
   - RDP/VM heuristics, screen-capture polling, and proctoring socket heartbeats logged to backend

## Testing
- Backend unit tests (grading flow):
  ```bash
  cd backend
  npm test
  ```

## Deployment Notes
- **Backend**: `npm run build` then run `node dist/main.js` (configure environment for Postgres + S3). Deploy behind HTTPS with a reverse proxy; forward structured logs to your log pipeline.
- **Frontend**: `npm run build && npm start` (set `NEXT_PUBLIC_API_BASE_URL`/`NEXT_PUBLIC_WS_URL` to production endpoints).
- **Electron**: `npm run build` yields compiled JS for `electron .`; package with a builder of choice (e.g., electron-builder) once signing/distribution requirements are defined.

## Logging and Security
- Backend logs all API/websocket activity with Pino; sensitive headers are redacted. Centralized HTTP exception filter returns sanitized errors to clients.
- Client-side logging endpoints (`/logs`) accept frontend/electron events and stream them to backend logs.
- Helmet, CORS, and rate limiting are enabled globally. S3 signed URL helpers are ready for media uploads/downloads.
- Electron app runs with `contextIsolation`, `sandbox`, disabled window opens, and shortcut suppression; focus loss, blocked accelerators, RDP/VM heuristics, screen-capture polls, and print-screen attempts are logged.
- Prisma schema includes Users (role-based), Exams, Questions, Sessions, RequestLog, SocketEventLog, and ProctoringEvent. Auth endpoints (`/auth/register`, `/auth/login`) issue JWTs.
- Protected API routes (exam create/grade/fetch) expect `Authorization: Bearer <token>` from the JWT returned at login/registration.
- Use `npm run prisma:migrate -- --name init` against your target `DATABASE_URL` (remote or local). To avoid accidental resets on shared DBs, ensure you run this on a dev database or use `prisma migrate deploy` in production.

## Database and Migrations
- Postgres is provisioned via `docker-compose`. Connect using `DATABASE_URL`.
- Prisma is configured with sample models (Users, Exams, Questions, Sessions, Attempts, Request/Socket logs, Proctoring events). Run `npm run prisma:generate` and `npm run prisma:migrate -- --name init` (or `npm run prisma:deploy` for prod) to create/apply the schema.

## High-Level Architecture
```
[Next.js Portal] ---- REST ----\
                                \
                                 [NestJS Backend] ---- PostgreSQL
[Electron Secure Client] -- WS ---/                 \
                                                    \---- AWS S3 (exam media, proctoring artifacts)
```

## Next Steps
- Implement persistence (exam models, question bank, scheduling) with migrations.
- Build real-time proctoring pipelines (webcam/audio ingestion + analytics workers).
- Flesh out evaluator workflows (anonymous grading, exports) and PDF import tooling.
- Harden Electron lockdown further (screen capture prevention, RDP/VM detection, integrity checks).
