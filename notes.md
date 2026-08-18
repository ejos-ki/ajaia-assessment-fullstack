# Build Notes — Ajaia AI-Native Full Stack Assessment

Scratch log kept while building. One line per decision, kept as I go —
this gets distilled into the final README / architecture note / AI
workflow note at the end. Not meant to be polished, just honest.

---

## Setup

- Repo: `ajaia-assessment-fullstack`, public on GitHub.
- Stack decision: Next.js 15 (App Router) + MongoDB Atlas (free M0 tier)
  + Mongoose + TipTap + Tailwind, deployed to Vercel. Chosen over
  Postgres/Supabase because it's my existing MERN background — no
  learning-curve tax under a hard timer.
- Deployed a blank Next.js skeleton to Vercel *before* writing any
  features, specifically to de-risk deployment failure late in the
  timer. Confirmed live early.
- Mongo free tier (512MB) is more than enough for this scope — storing
  uploaded file content as plain text in the same `content` field as
  any other document, not as a separate blob/GridFS. Simpler, avoids
  storage-limit concerns entirely.

## Scope cuts (intentional, per assessment's own allowance)

- Auth: seeded/mocked users only (`alice@example.com`, `bob@example.com`,
  both `password123`), no public signup flow. Documented in README as
  intentional, not an oversight.
- Sharing: single shared collaborator per document, editor-level access
  only — no granular roles. Demonstrates working logic without building
  full ACL.
- No rate limiting on login endpoint. Flagged as a known gap in README
  rather than silently skipped — deferred until core features + tests +
  docs are done, since it's hardening, not core functionality.

## Decisions & AI-assisted work log

- Built MongoDB connection as a singleton (`lib/mongodb.ts`) to avoid
  connection storms from Next.js dev hot-reload re-running the connect
  call on every file save.
- Sessions via httpOnly JWT cookie rather than client-readable token —
  mitigates XSS token theft. 7-day expiry, no refresh flow (out of scope
  for assessment).
- Login error message is identical for "no such user" and "wrong
  password" — avoids leaking which emails are registered.
- Caught and fixed an AI-generated naming issue: initial document API
  draft used short/acronym variable names (`doc`, `req`, `u`), which
  also caused a TypeScript type-narrowing bug on the authorization
  check. Refactored to descriptive names (`document`, `request`,
  `collaboratorId`) and an explicit typed result/type-guard pair
  instead of an ambiguous inline object — fixed the bug and made the
  code readable by a non-technical reviewer.
- Applied an academic/paper visual theme (cream background, warm
  brown accents, serif type) instead of default Tailwind gray —
  product-judgment call to make the editor feel intentional rather
  than templated.

## What I'd do next with more time

*(fill in near the end — this becomes part of the "what's incomplete /
what's next" section in the submission)*

## Known limitations

*(running list — add as they come up, don't wait until the end)*


- Sharing verified end-to-end: Alice shares doc with Bob, Bob sees it on
  his dashboard with edit access but no delete/share controls (owner-only
  actions correctly gated both in UI and API).