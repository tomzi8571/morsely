# Morsely — Architecture Guardrails

**Branch:** `experimental`  
**Date:** 2026-04-10  
**Role:** Core implementation guidance for all contributors and AI agents

---

## 1. Mission and Non-Goals

### Mission
Build a gamified, mobile-first Morse-code learning platform that is fun for beginners and rigorous for advanced learners, delivered as a PWA with a portable, engine-driven backend.

### Non-Goals
- Morsely is **not** a general-purpose audio/communication app.
- Morsely is **not** a social network (no DMs, no public profiles in scope).
- The learning engine is **not** tightly coupled to any web framework — it must be replaceable.
- Do **not** implement billing, ads, or data monetisation.
- Do **not** add features that are not in the current milestone scope.

---

## 2. Architecture Principles

1. **Engine independence.** The learning engine is a pure TypeScript module with no Express, React, or ORM imports. It receives and returns plain data objects.

2. **API as the contract.** The frontend communicates with the backend exclusively through versioned REST endpoints (`/api/v1/`). No shared runtime state, no direct DB access from the frontend.

3. **Mobile-first, progressive enhancement.** Every UI component is designed for a small touch screen first. Desktop features are additive, not required for core flows.

4. **Fail loudly in dev, fail gracefully in prod.** In development, errors crash hard so they are found fast. In production, errors are caught, logged, and surfaced to users as friendly messages.

5. **Incremental delivery.** Every merged increment must leave the app in a fully working, buildable, and deployable state. No half-finished features on shared branches.

6. **Data integrity over speed.** User progress, XP, and streaks are written atomically. Never sacrifice correctness for perceived performance.

7. **Consistency in naming.** Use the canonical domain vocabulary everywhere — in code, APIs, database columns, and documentation. No synonyms.

---

## 3. Canonical Domain Vocabulary

| Canonical Term | Meaning | Forbidden Synonyms |
|---------------|---------|-------------------|
| `trail` | The top-level learning curriculum | course, curriculum |
| `section` | A topic cluster within a trail | session, chapter, unit |
| `lesson` | A focused practice session within a section | progression, level, stage |
| `practice` | A single exercise item within a lesson | exercise, question, task |
| `practiceType` | The modality of a practice item | mode, kind, variant |
| `attempt` | A user's submission for a practice | answer, response, input |
| `xp` | Experience points | points, score (score is lesson-level only) |
| `score` | Lesson completion percentage (0–100) | grade, result |
| `streak` | Consecutive active days | combo, chain |
| `symbol` | A single Morse character (letter, digit, punctuation) | character, char, letter (unless specifically a letter) |

---

## 4. Module Boundaries and Anti-Coupling Rules

### Allowed dependencies

```
Frontend  →  API Layer   (HTTP only, no shared code)
API Layer →  Engine      (function calls / service instantiation)
API Layer →  Persistence (repository calls)
Engine    →  (nothing)   (pure functions, injectable interfaces only)
```

### Forbidden dependencies

| From | To | Why |
|------|----|-----|
| Engine | Express / Fastify | Engine must be framework-agnostic |
| Engine | Drizzle / any ORM | Engine uses repository interfaces, not implementations |
| Engine | React | Engine has no UI concerns |
| Frontend | Database | No direct DB access from browser |
| Frontend | Engine module | Engine logic lives server-side only |
| API Layer | Frontend code | No circular dependencies |

### Module structure

```
/
├── src/                   # Frontend (React + Vite)
│   ├── components/
│   ├── hooks/
│   ├── pages/
│   └── api/               # Typed fetch wrappers (thin, no logic)
│
├── server/                # Backend (Node.js + TypeScript)
│   ├── api/               # Route handlers (thin orchestration only)
│   ├── engine/            # Learning engine (pure TypeScript)
│   │   ├── evaluation/
│   │   ├── progression/
│   │   ├── scoring/
│   │   └── repositories/  # Interfaces only (no implementations)
│   ├── db/                # Drizzle schema, migrations, repository implementations
│   └── middleware/        # Auth, validation, error handling
│
├── docs/                  # Architecture docs (plan.md, agents.md, etc.)
└── scripts/               # Build / deploy utilities
```

---

## 5. Coding Standards

### TypeScript
- Strict mode enabled (`"strict": true` in `tsconfig.json`).
- No `any` except at external boundaries (JSON parsing, third-party library gaps); always narrow as soon as possible.
- All public engine functions must have explicit return types.
- Prefer `interface` for domain entities; `type` for unions and utility types.

### React
- Functional components only; no class components.
- Custom hooks for all stateful logic (no state in utility files).
- Props validated with TypeScript interfaces (not PropTypes in new code).
- Component names are PascalCase; hooks are `useXxx`.
- CSS: Tailwind utility classes first; component-scoped `.module.css` for complex overrides; no inline styles.

### Naming
- Use the canonical domain vocabulary (§3) in all code, APIs, database columns, and tests.
- File names match their default export (e.g., `TrailMap.tsx` exports `TrailMap`).
- Database columns: `snake_case`. TypeScript fields: `camelCase`. Both map via Drizzle column mapping.

### API
- All endpoints return JSON.
- Success responses use `2xx` codes with a typed body.
- Error responses use `{ "error": { "code": string, "message": string } }`.
- Validation errors return `400` with field-level detail.
- Auth errors return `401`; authorisation errors return `403`.

### Tests
- Test files live adjacent to the code they test: `foo.test.ts` next to `foo.ts`.
- E2E tests live in `tests/e2e/`.
- Test names describe behaviour: `"returns 401 when token is expired"`, not `"auth test 3"`.

### Comments and Documentation
- Comments explain **why**, not what. Code explains what.
- Public engine functions have JSDoc with `@param` and `@returns`.
- Avoid stale comments; delete them when the code changes.

---

## 6. Definition of Done (per Increment)

An increment is **done** when ALL of the following are true:

- [ ] All new code passes `npm run lint` with zero errors.
- [ ] `npm run build` succeeds (both frontend and server).
- [ ] All new engine logic has unit tests with ≥ 90% branch coverage.
- [ ] All new API endpoints have integration tests covering happy path and key error cases.
- [ ] Affected E2E journeys pass.
- [ ] No new `any` types introduced without a comment explaining the exception.
- [ ] Domain vocabulary is consistent (no forbidden synonyms).
- [ ] The app loads and runs end-to-end in a browser (manual smoke check or E2E).
- [ ] A `RELEASE_NOTES.md` entry is added (or an existing section is updated).

---

## 7. Test Gates and CI Expectations

### Required CI checks (block merge if failing)

| Check | Command | Scope |
|-------|---------|-------|
| Lint | `npm run lint` | All TypeScript and JSX |
| Unit tests | `npm run test:unit` | Engine, hooks, utilities |
| Integration tests | `npm run test:integration` | API endpoints |
| Frontend build | `npm run build` | Vite production build |
| Server build | `npm run build:server` | TypeScript compile + bundle |

### Advisory CI checks (must not regress)

| Check | Command |
|-------|---------|
| E2E tests | `npm run test:e2e` |
| Bundle size | Vite bundle report; flag if > 10% increase |

### Coverage gates
- Engine module: ≥ 90% branch coverage enforced in CI.
- API layer: ≥ 80% line coverage.
- Frontend components: coverage is advisory; E2E covers critical paths.

---

## 8. Refactor Rules

### When to refactor
- When a function exceeds 40 lines of meaningful logic (not JSX).
- When a module is imported by more than 5 other modules for reasons other than types.
- When a domain concept appears in 3+ places without a single canonical implementation.
- When a test requires more than 5 lines of mocking setup for a simple case (the code is too coupled).

### How to refactor
- Refactors are a separate commit from feature work; do not mix.
- The refactor commit must leave all tests green.
- Rename domain terms immediately when they violate the canonical vocabulary (§3); this is always justified.
- When extracting a module, define the interface first, then move the implementation.

### What not to refactor
- Do not refactor working code purely for aesthetics during a feature increment.
- Do not change the API contract without bumping the version.
- Do not rename database columns without a migration.

---

## 9. Portability Constraints

The learning engine must remain replaceable. To guarantee this:

1. **No framework code in the engine.** If `import express` or `import react` appears in `server/engine/`, it is a bug.

2. **Repository pattern.** The engine depends only on repository interfaces defined in `server/engine/repositories/`. Implementations live in `server/db/`. This allows the engine to be tested without a real database and deployed to a different runtime.

3. **DTO boundaries.** The engine receives plain TypeScript objects (DTOs) and returns plain TypeScript objects. No ORM model instances cross the engine boundary.

4. **API versioning.** The `/api/v1/` prefix is a contract. A future Java Spring Boot backend can implement the same contract without any frontend changes.

5. **No vendor lock-in in engine logic.** If an AI provider is used for `scenario-ai`, the engine calls an `AIService` interface. The concrete implementation is injected; the engine does not import any AI SDK directly.

6. **Document all external contracts.** Every API endpoint and every repository interface must be documented as a contract, not an implementation detail.

---

## 10. Security Guardrails

- Never log passwords, tokens, or PII.
- Always validate and sanitise API inputs with Zod schemas before they reach the engine.
- Never trust client-supplied IDs without verifying ownership (e.g., `userId` from JWT, not request body).
- JWT secrets must be in environment variables, never in source code.
- Dependencies must be audited with `npm audit` before adding; do not introduce packages with known high/critical CVEs.
- HttpOnly, Secure, SameSite=Strict for refresh token cookies in production.

---

## 11. Quick Reference — Adding a New Practice Type

When adding a new `PracticeType`:

1. Add the type to the `PracticeType` union in `server/engine/evaluation/types.ts`.
2. Add an `evaluator` function in `server/engine/evaluation/evaluators/`.
3. Register the evaluator in `server/engine/evaluation/evaluate.ts`.
4. Add base XP points to the `XP_BASE_POINTS` map in `server/engine/scoring/xp.ts`.
5. Add at least one practice of this type to a lesson in the seed data.
6. Add a unit test for the evaluator.
7. Add an E2E test for the new practice type if it has a new UI component.
8. Update `plan.md` §4 table if the type is new.
