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
   - Landing + persona flows: `http://localhost:3000/`
   - Admin exam builder: `http://localhost:3000/exams/builder`
   - Student secure-launch page (Electron download + deep link): `http://localhost:3000/exams/launch`
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
- Frontend (Next.js) checks:
  ```bash
  cd frontend
  npm test          # component/unit tests
  npm run lint      # ESLint/TypeScript linting
  npm run playwright # UI/e2e tests when present
  ```
  - Store new frontend unit/integration specs under `frontend/__tests__` or co-located `*.test.ts(x)` files.
- Electron app checks:
  ```bash
  cd electron-app
  npm test          # preload + IPC unit tests
  npm run lint      # lint preload/renderer code
  npm run smoke     # lightweight electron launch/smoke flow when defined
  ```
  - Place preload/IPC unit tests under `electron-app/__tests__` or alongside modules in `electron-app/src`.
- Planned integration/e2e coverage:
  - End-to-end runs should exercise backend APIs from both the frontend (browser) and Electron client. Suggested placement: `frontend/playwright` for portal-to-backend journeys and `electron-app/tests/e2e` for secure client scenarios (exam launch, logging, offline queue replay).
  - Start required services before running cross-app tests:
    ```bash
    docker-compose up -d           # Postgres + LocalStack (S3)
    cd backend && npm run start:dev # API/WS
    cd ../frontend && npm run dev   # Portal (if testing browser flows)
    cd ../electron-app && npm run dev # Electron preload/renderer for client flows
    ```
  - Use `.env` values that point both clients to the same backend and LocalStack endpoints. Planned e2e suites should assume Node.js 20+, running on macOS/Windows/Linux with an X11/Wayland/GUI-capable environment for Electron launch.

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
                (Proctoring streams: webcam/audio, screen events)
 [Next.js Portal] --- REST/WS ---\                                \\
                                  \                                \\
                                   \                                \\
 (Log forwarding: UI + Electron)    [NestJS Backend] --- Prisma ---> PostgreSQL
 (Offline replay queue flush)      /    |     |  \\
 [Electron Secure Client] -- WS ---     |     |   \\__ Signed URLs --> AWS S3 (exam media + proctoring artifacts)
                                      Webhooks  |    
                                    (future AI  |  (Analytics workers consume S3 + DB)
                                     proctors)  |    
                                               REST/WS responses back to clients
```

## Delivery Roadmap
### Milestone 1: Exam Modeling & Scheduling
- **Scope**: Define exam entities, question banks, session windows, and seat allocation with basic CRUD in `backend/` and management UI in `frontend/`.
- **Acceptance Criteria**: REST endpoints for exams/schedules, Prisma migrations applied, admin UI to create/publish exams, schedule validation (no overlap) enforced.
- **Ownership**: Backend + Frontend.
- **Interfaces**: REST (`/api/exams`, `/api/schedules`), WebSocket notifications for schedule updates; exam media signed URL flow via S3 utilities.
- **Links**: `backend/`, `frontend/`.

### Milestone 2: AI Proctoring Ingest & Processing
- **Scope**: Real-time WebSocket channels for webcam/audio/screen streams from `electron-app/`, event normalization in `backend/`, and S3 storage for artifacts with stubbed AI hooks.
- **Acceptance Criteria**: WS rooms per session, ingest pipeline persists proctoring events, artifacts written to S3 via signed URLs, alerts echoed to UI; log forwarding persisted.
- **Ownership**: Backend + Electron.
- **Interfaces**: WebSocket namespace `/proctoring`, REST for artifact presigns (`/api/proctoring/signed-urls`), S3 upload/download paths, optional webhook surface for AI processors.
- **Links**: `backend/`, `electron-app/`.

### Milestone 3: Offline Electron Sync & Replay
- **Scope**: Enhance `electron-app/` offline queue for exams, attempts, and logs; backend endpoints tolerate idempotent replay; delta sync for scheduled exams.
- **Acceptance Criteria**: Electron can take/sync an exam offline, replay WS/REST payloads when online, conflict resolution rules documented, retries with backoff logged.
- **Ownership**: Electron + Backend.
- **Interfaces**: REST batching (`/api/offline/replay`), WS reconnect handshake re-sends buffered proctoring events, S3 resumable uploads for large artifacts.
- **Links**: `electron-app/`, `backend/`.

### Milestone 4: Evaluator Grading Workflows
- **Scope**: Build evaluator queues and grading UI in `frontend/`, grading APIs and scoring logic in `backend/`, plus audit logging.
- **Acceptance Criteria**: Worklists by role, rubric scoring with comments, grade submission endpoints, audit trail persisted; anonymized candidate view toggles.
- **Ownership**: Backend + Frontend.
- **Interfaces**: REST (`/api/grades`, `/api/attempts/{id}`), WebSocket notifications for grade state changes, exports via S3 signed URLs for rubrics/templates.
- **Links**: `frontend/`, `backend/`.

### Milestone 5: Reporting & Exports
- **Scope**: Reporting dashboards in `frontend/` that query aggregated metrics from `backend/`, export flows to CSV/PDF with S3-backed downloads.
- **Acceptance Criteria**: REST endpoints for summary and per-exam metrics, export jobs generate downloadable links, performance baselines logged; administrator access control enforced.
- **Ownership**: Backend + Frontend.
- **Interfaces**: REST (`/api/reports/*`, `/api/exports`), WebSocket for job completion notifications, S3 presigned download URLs.
- **Links**: `backend/`, `frontend/`.

## Next Steps
- Implement persistence (exam models, question bank, scheduling) with migrations.
- Build real-time proctoring pipelines (webcam/audio ingestion + analytics workers).
- Flesh out evaluator workflows (anonymous grading, exports) and PDF import tooling.
- Harden Electron lockdown further (screen capture prevention, RDP/VM detection, integrity checks).
