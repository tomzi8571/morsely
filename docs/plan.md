# Morsely — Platform Evolution Plan

**Branch:** `experimental`  
**Date:** 2026-04-10  
**Status:** Implementation-ready architecture blueprint

---

## 1. Product Scope and Assumptions

### Vision
Morsely evolves from a single-page practice tool into a **gamified Morse-code learning platform** inspired by Duolingo, Brilliant.org, and Anton. The product must serve both casual learners and high-skill operators, with a clear progression path from first character to conversational fluency.

### Scope (this plan)
- Structured learning trail with Sections → Lessons → Practices
- Multiple practice modalities (decode, encode, audio-only, conversational)
- Per-user progression state: streaks, XP, accuracy, unlock flow
- Clean separation between frontend app and learning engine
- PWA, mobile-first, responsive desktop
- Node.js + TypeScript backend with portable API contracts

### Out of scope (deferred)
- Real-person live exchange mode
- Paid tiers / billing
- Native iOS/Android wrappers
- Offline-first full sync (service worker cache for static assets only, for now)
- Multiplayer / social leaderboards (architecture must support it later)

### Assumptions
- The Koch method sequence is the canonical letter introduction order.
- Users authenticate via a lightweight account system (email + password, or anonymous guest with upgrade path).
- All user state is server-side; local storage is a write-through cache only.
- Audio generation is client-side (Web Audio API) for now; server-generated audio is a future option.

---

## 2. Architecture Blueprint

```
┌──────────────────────────────────────────────────────────────┐
│                        Frontend (PWA)                         │
│   React + Tailwind + Semantic UI + CSS                        │
│   ┌──────────────┐  ┌──────────────┐  ┌───────────────────┐  │
│   │ Trail UI     │  │ Practice UI  │  │ Progress / Stats  │  │
│   └──────┬───────┘  └──────┬───────┘  └────────┬──────────┘  │
│          └─────────────────┴───────────────────┘              │
│                     HTTP / REST API (v1)                       │
└─────────────────────────────┬────────────────────────────────┘
                               │
┌─────────────────────────────▼────────────────────────────────┐
│                  API Layer  (Express + TypeScript)            │
│   /api/v1/*   — versioned, stateless, JSON                    │
│   Auth middleware, request validation, error mapping          │
└─────────────────────────────┬────────────────────────────────┘
                               │
┌─────────────────────────────▼────────────────────────────────┐
│                   Learning Engine (TypeScript)                 │
│   Domain logic: trail, progression, scoring, evaluation       │
│   Exposed as pure functions / service classes                  │
│   Zero framework dependencies (portable to any stack)         │
└─────────────────────────────┬────────────────────────────────┘
                               │
┌─────────────────────────────▼────────────────────────────────┐
│               Persistence Layer (SQLite → Postgres)           │
│   Drizzle ORM with migration-first schema management          │
└──────────────────────────────────────────────────────────────┘
```

### Frontend Boundaries
- Owns all rendering, animation, audio playback, and keyboard/tap capture.
- Calls the API for all state mutations and reads.
- May read from a local cache (IndexedDB / localStorage) for speed, but the server is always the source of truth.
- **Must not** contain scoring formulas, unlock logic, or accuracy thresholds — those live in the engine.

### Learning Engine Boundaries
- Pure TypeScript module (no Express, no React, no DB driver imports).
- Receives DTOs from the API layer; returns result DTOs.
- Contains: progression evaluation, XP calculation, streak logic, accuracy tracking, unlock gate checks, practice evaluation.
- Unit-testable without a running server.

### API Layer Boundaries
- Thin orchestration: validate → call engine → persist → respond.
- All endpoints versioned under `/api/v1/`.
- Responsible for authentication, authorization, and HTTP error codes.
- Must not contain business logic.

### Persistence Layer Boundaries
- All DB access through Drizzle ORM repositories.
- Migrations are code-first, committed to the repo.
- Repository interfaces are defined in the engine package so they can be mocked in tests.

---

## 3. Domain Model

### Entities and Relationships

```
Trail
  └── Section[]           (ordered; each covers a topic, e.g., "Letters E-T-I-M-A")
        └── Lesson[]       (ordered; each trains the section topic)
              └── Practice[]  (ordered; concrete exercise items)

User
  └── UserProgress
        ├── TrailProgress[]
        ├── SectionProgress[]
        ├── LessonProgress[]
        └── PracticeResult[]

UserStats
  ├── streak (current days, last active date)
  ├── xp (total, level)
  └── accuracy (per symbol, per practice type)
```

### Core Entity Definitions

```typescript
// Trail — top-level curriculum container
interface Trail {
  id: string;
  version: number;
  title: string;
  sections: Section[];
}

// Section — a topic cluster (e.g., Koch step 1–3)
interface Section {
  id: string;
  trailId: string;
  order: number;
  title: string;
  description: string;
  introducedSymbols: string[];   // new Koch letters introduced here
  unlockThreshold: number;       // % of previous section required to unlock
  lessons: Lesson[];
}

// Lesson — a focused practice session
interface Lesson {
  id: string;
  sectionId: string;
  order: number;
  title: string;
  practices: Practice[];
}

// Practice — a single exercise item
interface Practice {
  id: string;
  lessonId: string;
  order: number;
  type: PracticeType;
  payload: PracticePayload;     // varies by type (see §5)
  difficultyWeight: number;     // multiplier for XP calculation
}

type PracticeType =
  | 'morse-to-latin'      // see Morse → type Latin
  | 'latin-to-morse'      // read Latin → tap Morse
  | 'audio-to-latin'      // hear audio → type Latin
  | 'audio-to-morse'      // hear audio → tap Morse
  | 'scenario-scripted'   // scripted conversational exchange
  | 'scenario-ai';        // AI-driven conversational exchange (future)

// User progress snapshot for a single lesson
interface LessonProgress {
  userId: string;
  lessonId: string;
  completedAt: Date | null;
  score: number;             // 0–100
  attempts: number;
  xpEarned: number;
}

// Individual practice attempt result
interface PracticeResult {
  id: string;
  userId: string;
  practiceId: string;
  attemptedAt: Date;
  correct: boolean;
  input: string;            // what the user submitted
  latencyMs: number;        // time from prompt to submission
}

// Per-symbol accuracy (used for spaced repetition hints)
interface SymbolAccuracy {
  userId: string;
  symbol: string;           // single letter/number/punctuation
  practiceType: PracticeType;
  correct: number;
  total: number;
  lastAttemptedAt: Date;
}

// Streak and XP state
interface UserStats {
  userId: string;
  xp: number;
  level: number;
  streakDays: number;
  lastActiveDate: string;   // ISO date string YYYY-MM-DD
}
```

### Progression State Machine

```
Locked → Unlocked → In Progress → Completed
```

- **Locked:** prerequisites not met.
- **Unlocked:** prerequisites met; learner can start.
- **In Progress:** at least one practice attempted.
- **Completed:** all practices in the lesson answered; score assigned.

Unlock rules:
- Lesson `n+1` unlocks when lesson `n` is completed (any score).
- Section `n+1` unlocks when the section's completion percentage (lessons completed / total) reaches `section.unlockThreshold` (default 80%).

---

## 4. Practice Engine Design and Evaluation Pipeline

### Evaluation Pipeline (per attempt)

```
User Input
    │
    ▼
InputNormalizer          — trim, lowercase, strip diacritics
    │
    ▼
PracticeEvaluator        — type-specific correctness check
    │
    ▼
AccuracyUpdater          — update per-symbol SymbolAccuracy
    │
    ▼
XPCalculator             — compute XP for this attempt
    │
    ▼
LessonScoreAggregator    — recompute lesson score
    │
    ▼
ProgressionGateChecker   — determine unlock side-effects
    │
    ▼
StreakUpdater            — update streak if daily threshold met
    │
    ▼
PersistenceWriter        — write all changes atomically
    │
    ▼
ResultDTO                — return to API layer
```

### Practice Type Evaluation Logic

| Type | Correct if |
|------|-----------|
| `morse-to-latin` | Normalised input matches expected Latin string |
| `latin-to-morse` | Submitted Morse sequence matches canonical encoding |
| `audio-to-latin` | Same as morse-to-latin |
| `audio-to-morse` | Same as latin-to-morse |
| `scenario-scripted` | User's response matches expected exchange step |
| `scenario-ai` | AI scores exchange (future; engine calls AI service) |

### Lesson Score Formula
```
score = (correctPractices / totalPractices) * 100
```
100% only when every practice is answered correctly on first attempt.

---

## 5. XP and Streak Model

### XP Rules

```
baseXP(practice) = practiceType.basePoints * practice.difficultyWeight

bonuses:
  + newSymbolBonus   if practice introduces a symbol not yet mastered by user
  + streakMultiplier = 1 + (min(streakDays, 30) * 0.01)   (max +30%)
  + perfectLessonBonus if lesson score = 100%

finalXP = baseXP * streakMultiplier + bonuses
```

Base points by type:
| Practice type | Base XP |
|---------------|---------|
| `morse-to-latin` | 10 |
| `latin-to-morse` | 12 |
| `audio-to-latin` | 15 |
| `audio-to-morse` | 18 |
| `scenario-scripted` | 25 |
| `scenario-ai` | 40 |

### Level Thresholds
Level uses a simple quadratic scale:  
`xpForLevel(n) = 100 * n^2`  
(Level 1 = 100 XP, Level 5 = 2500 XP, Level 10 = 10,000 XP)

### Streak Rules
- A streak day is counted when at least one practice is completed on a calendar day (UTC).
- Missing a day resets streak to 0.
- Streak freeze: deferred feature; architecture records `lastActiveDate` to support it.

---

## 6. API Contract Design

All endpoints are under `/api/v1/`. Authentication via Bearer JWT.

### Core Endpoints

```
Authentication
  POST   /api/v1/auth/register
  POST   /api/v1/auth/login
  POST   /api/v1/auth/refresh
  DELETE /api/v1/auth/logout

Trail
  GET    /api/v1/trail                   — full trail with sections and lesson stubs
  GET    /api/v1/trail/sections/:id      — section detail with lessons

Lesson
  GET    /api/v1/lessons/:id             — lesson with ordered practices
  POST   /api/v1/lessons/:id/start       — create in-progress lesson attempt
  POST   /api/v1/lessons/:id/complete    — finalise lesson, receive score + XP

Practice
  POST   /api/v1/practices/:id/attempt   — submit an answer; receive result + XP

User Progress
  GET    /api/v1/me/progress             — trail/section/lesson completion state
  GET    /api/v1/me/stats                — XP, level, streak
  GET    /api/v1/me/accuracy             — per-symbol accuracy stats
```

### Request / Response Shape Example

`POST /api/v1/practices/:id/attempt`

Request:
```json
{
  "input": ".-",
  "latencyMs": 1420
}
```

Response (200):
```json
{
  "correct": true,
  "xpEarned": 14,
  "streakDays": 5,
  "lessonScore": 75,
  "accuracy": { "A": { "correct": 12, "total": 14 } },
  "unlockedLessons": []
}
```

### Versioning Strategy
- URL versioning (`/api/v1/`) is the primary mechanism.
- A future `/api/v2/` can coexist; the frontend detects capability via an `/api/version` endpoint.
- Breaking changes always bump the major version.

---

## 7. Database Schema

### Migration Strategy
- Drizzle ORM with `drizzle-kit` for migration generation.
- All migrations are committed SQL files (`db/migrations/`).
- `dev`: SQLite (zero-setup local dev).
- `production`: PostgreSQL.
- Schema is identical between environments via Drizzle's dialect abstraction.

### Core Tables

```sql
-- Users
users (id, email, passwordHash, createdAt, updatedAt)

-- Trail content (seeded from JSON, not user-editable)
trails (id, version, title, createdAt)
sections (id, trailId, order, title, description, introducedSymbols, unlockThreshold)
lessons (id, sectionId, order, title)
practices (id, lessonId, order, type, payload JSON, difficultyWeight)

-- User progress
user_stats (userId PK, xp, level, streakDays, lastActiveDate)
lesson_progress (id, userId, lessonId, score, attempts, completedAt, xpEarned)
practice_results (id, userId, practiceId, attemptedAt, correct, input, latencyMs)
symbol_accuracy (userId, symbol, practiceType, correct, total, lastAttemptedAt)
  PRIMARY KEY (userId, symbol, practiceType)
```

---

## 8. PWA / Mobile-First Technical Requirements

- **Service Worker:** Workbox (via `vite-plugin-pwa`) for asset caching and background sync of practice results when offline.
- **Manifest:** `manifest.webmanifest` with icons, theme colour, `display: standalone`.
- **Viewport:** CSS custom property `--app-height` driven by `visualViewport` (existing pattern retained).
- **Virtual Keyboard:** `navigator.virtualKeyboard.overlaysContent = true` (existing pattern retained).
- **Touch targets:** Minimum 44×44px (Apple HIG / WCAG 2.5.5).
- **Responsive:** Mobile-first breakpoints; desktop gains a sidebar trail map.
- **Input:** Tap-to-encode uses a single large button with timing detection; keyboard input for Latin answers on desktop auto-focuses.
- **Audio:** Web Audio API, no external audio files required for Morse tones.

---

## 9. Testing Strategy

### Unit Tests (Vitest)
- Learning engine functions tested in isolation:
  - `evaluatePractice()`
  - `calculateXP()`
  - `updateStreak()`
  - `checkUnlockGates()`
  - `aggregateLessonScore()`
- Repository interfaces mocked with in-memory implementations.
- Target: ≥ 90% branch coverage on engine module.

### Integration Tests (Vitest + Supertest)
- API endpoints tested against an in-memory SQLite database:
  - Auth flow (register → login → JWT refresh)
  - Full practice attempt lifecycle
  - Lesson completion and unlock side-effects
- Seed fixtures for trail content.

### E2E Tests (Playwright)
Key learner journeys:
1. New user registers → sees first lesson → completes first practice → earns XP.
2. User completes all lessons in a section → next section unlocks.
3. User returns on consecutive days → streak increments.
4. User fails practice → lesson score < 100%.
5. Mobile: tap-to-encode practice submits correct Morse.

### Test Gates (CI)
- `npm run test:unit` — must pass before merge.
- `npm run test:integration` — must pass before merge.
- `npm run test:e2e` — must pass on main/experimental.
- `npm run lint` — zero errors.
- `npm run build` — must succeed.

---

## 10. Observability and Analytics

### Basics (Phase 1)
- Structured server logs (JSON, log level from env var) using `pino`.
- Request/response logging middleware (method, path, status, latency).
- Error tracking: uncaught exceptions logged with stack traces.

### Analytics events (emitted to a log stream, queryable later)
- `practice_attempted` { userId, practiceId, type, correct, latencyMs }
- `lesson_completed` { userId, lessonId, score, xpEarned }
- `section_unlocked` { userId, sectionId }
- `streak_updated` { userId, streakDays }
- `level_up` { userId, newLevel }

### Deferred
- Dashboards (Grafana / PostHog / Plausible).
- Funnel analysis, cohort retention.

---

## 11. Security and Privacy

- **Passwords:** bcrypt with cost factor ≥ 12.
- **JWT:** Short-lived access tokens (15 min) + long-lived refresh tokens (30 days, rotating, stored HttpOnly cookie).
- **Input validation:** Zod schemas on all API inputs; no raw SQL.
- **CORS:** Strict origin allowlist in production.
- **Rate limiting:** express-rate-limit on auth endpoints (5 req/min per IP).
- **PII:** Email is the only PII stored. Practice data is non-PII. GDPR: deletion endpoint `/api/v1/me/account` (DELETE).
- **HTTPS only** in production (enforced at hosting layer).

---

## 12. Stepwise Refactor Strategy

### From Current Code to Target Architecture

**Step 0 — Stabilise current code (no regressions)**
- Rename `ExerciseStatus` → `PracticeState` in frontend (preparation for new naming).
- Map current `session`/`progression`/`exercise` to `section`/`lesson`/`practice` in data files.
- Ensure `npm run build` and `npm run lint` pass.

**Step 1 — Add backend scaffold (Milestone 1)**
- Create `server/` directory with Express + TypeScript.
- Define engine module structure with placeholder implementations.
- Add Drizzle + SQLite, run first migration.
- Auth endpoints operational.

**Step 2 — Trail content API (Milestone 2)**
- Seed existing exercise data (currently in `Examples.jsx`) into database.
- Trail/section/lesson/practice read endpoints.
- Frontend fetches trail from API instead of static import.

**Step 3 — Practice attempt engine (Milestone 3)**
- Practice attempt endpoint with evaluation pipeline.
- XP and streak logic.
- Frontend submits answers to API; displays XP feedback.

**Step 4 — Unlock gates and progress UI**
- Section unlock logic.
- Trail map component showing locked/unlocked/completed states.

**Step 5 — Audio-only practice modality**
- Web Audio Morse tone generator (extract from existing component).
- `audio-to-latin` practice type end-to-end.

**Step 6 — Conversational / AI mode (future)**
- `scenario-scripted` type with scripted exchange data.
- AI mode hooks using engine's `scenario-ai` type and an LLM API call.

---

## 13. Milestone Backlog Checklist

---

### Milestone 0 — Foundation and Naming Alignment
**Scope:** Stabilise existing frontend; align naming; ensure build passes.

**Tasks:**
- [ ] Rename `session`/`progression`/`exercise` to `section`/`lesson`/`practice` in data and component props
- [ ] Extract Morse tone generation into a standalone `useMorseAudio` hook
- [ ] Ensure `npm run lint` and `npm run build` pass with zero errors
- [ ] Write Vitest config; add first smoke test

**Acceptance Criteria:**
- App loads and runs identically to current behaviour.
- Build and lint are clean.
- At least one passing unit test.

**Gates:** `lint`, `build`, `test:unit`

---

### Milestone 1 — Backend Scaffold + Auth
**Scope:** Node.js + TypeScript Express server; JWT auth; SQLite via Drizzle.

**Tasks:**
- [ ] `server/` package with TypeScript, ESM, `tsup` build
- [ ] Drizzle schema: `users`, `user_stats`
- [ ] `POST /api/v1/auth/register` and `POST /api/v1/auth/login`
- [ ] JWT middleware (`accessToken` + `refreshToken` cookie)
- [ ] Integration tests for auth endpoints

**Acceptance Criteria:**
- Register, login, and token-refresh flow tested end-to-end.
- Invalid credentials return 401; validation errors return 400.
- Server starts cleanly with `npm run dev:server`.

**Gates:** `lint`, `build`, `test:unit`, `test:integration`

---

### Milestone 2 — Trail Content API
**Scope:** Seed trail data; expose read-only trail/lesson/practice endpoints.

**Tasks:**
- [ ] Drizzle schema: `trails`, `sections`, `lessons`, `practices`
- [ ] Seed script converting existing exercise JSON to DB rows
- [ ] `GET /api/v1/trail`, `GET /api/v1/lessons/:id`
- [ ] Frontend fetches trail from API; renders existing UI unchanged
- [ ] Integration tests for trail endpoints

**Acceptance Criteria:**
- Trail data served from DB matches current static data.
- Frontend builds and renders with API-sourced data.

**Gates:** `lint`, `build`, `test:unit`, `test:integration`, `test:e2e` (journey 1 partial)

---

### Milestone 3 — Practice Attempt Engine + XP
**Scope:** Core learning engine; practice evaluation; XP and streak.

**Tasks:**
- [ ] Engine module: `evaluatePractice`, `calculateXP`, `updateStreak`
- [ ] Drizzle schema: `practice_results`, `lesson_progress`, `symbol_accuracy`
- [ ] `POST /api/v1/practices/:id/attempt`
- [ ] `POST /api/v1/lessons/:id/complete`
- [ ] `GET /api/v1/me/stats`
- [ ] Frontend shows XP gain and streak after practice
- [ ] Unit tests for all engine functions (≥ 90% coverage)
- [ ] Integration tests for attempt and complete endpoints

**Acceptance Criteria:**
- Correct answer awards XP matching formula; incorrect awards 0.
- Lesson score updates correctly; 100% only when all correct.
- Streak increments on first practice of a new day.
- All engine unit tests pass.

**Gates:** `lint`, `build`, `test:unit`, `test:integration`, `test:e2e` (journeys 1–4)

---

### Milestone 4 — Unlock Gates + Trail Map UI
**Scope:** Progression unlock logic; visual trail map.

**Tasks:**
- [ ] Engine: `checkUnlockGates` — lesson and section unlock logic
- [ ] `GET /api/v1/me/progress` endpoint
- [ ] Trail map React component (locked/unlocked/completed visual states)
- [ ] Section completion percentage display
- [ ] E2E test: complete section → next section unlocks

**Acceptance Criteria:**
- Locked lessons are not accessible.
- Section unlock triggers when threshold is met.
- Trail map reflects real-time progress.

**Gates:** `lint`, `build`, `test:unit`, `test:integration`, `test:e2e` (journey 2)

---

### Milestone 5 — Audio-Only Practice Modality
**Scope:** `audio-to-latin` practice type end-to-end.

**Tasks:**
- [ ] `useMorseAudio` hook: generate tones from Morse string via Web Audio API
- [ ] `AudioPractice` component: play tone, capture text input
- [ ] Engine evaluation for `audio-to-latin` type
- [ ] Add audio-only practices to at least one section
- [ ] E2E test: audio practice submits and scores correctly

**Acceptance Criteria:**
- Tone plays correctly for all letters and common prosigns.
- User can replay tone on demand.
- Score and XP awarded correctly.

**Gates:** `lint`, `build`, `test:unit`, `test:e2e` (journey 5)

---

### Milestone 6 — Tap-to-Encode (latin-to-morse) Modality
**Scope:** `latin-to-morse` practice type with timing-based tap input.

**Tasks:**
- [ ] `MorseTapInput` component: single button, records dit/dah by duration, spaces by gap
- [ ] Engine evaluation for `latin-to-morse` type
- [ ] Configurable timing thresholds (per-user setting)
- [ ] Unit tests for tap-timing → Morse string conversion

**Acceptance Criteria:**
- Tap correctly encodes common letters.
- Mis-taps provide visual feedback without crashing.
- Settings menu exposes dit/dah duration.

**Gates:** `lint`, `build`, `test:unit`, `test:e2e`

---

### Milestone 7 — Scripted Conversational Scenarios
**Scope:** `scenario-scripted` practice type.

**Tasks:**
- [ ] Scenario data model: script steps with expected exchange lines
- [ ] `ScenarioPractice` component: turn-based exchange UI
- [ ] Engine evaluation for scripted scenarios
- [ ] At least 3 scripted scenarios in trail content

**Acceptance Criteria:**
- User and "operator" exchange turns.
- Wrong response shows correct answer and marks step failed.
- Scenario score aggregates across exchange steps.

**Gates:** `lint`, `build`, `test:unit`, `test:integration`, `test:e2e`

---

### Milestone 8 — AI Conversational Mode (future)
**Scope:** `scenario-ai` practice type using LLM backend.

**Tasks:**
- [ ] AI service interface in engine (injectable, replaceable)
- [ ] Default implementation calling an LLM API
- [ ] `AIConversationPractice` component
- [ ] Fallback to scripted mode if AI service unavailable

**Acceptance Criteria:**
- AI responds in Morse-appropriate style.
- Latency < 3s for AI response.
- Graceful degradation if AI is down.

**Gates:** `lint`, `build`, `test:unit`, `test:integration`

---

## Appendix A — Koch Method Letter Sequence

```
K M U R E S N A P T L W I . J Z = F O Y , V G 5 / Q 9 2 H 3 8 B ? 4 7 C 1 D 6 0 X
```

Sections will map to Koch steps. Each section introduces 2–4 new characters.

## Appendix B — Deferred Decisions

| Decision | Deferred Until | Reason |
|----------|---------------|--------|
| Spaced repetition algorithm (SM-2 vs custom) | Milestone 3 retrospective | Need real accuracy data first |
| PostgreSQL migration timing | Production launch | SQLite sufficient for early scale |
| Real-time WebSocket for conversation mode | Milestone 8 | Complexity not needed yet |
| Push notifications for streak reminders | Post-MVP | Requires VAPID key management |
| AI provider choice (OpenAI / local LLM) | Milestone 8 | Cost and latency TBD |
| Social features (friends, leaderboards) | Post-MVP | Architecture preserves userId-scoped data |
