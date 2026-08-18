# Architecture Note

## What this is

A scoped-down Google Docs clone: one document type, rich text editing,
file-based document creation, and simple owner/collaborator sharing —
built to demonstrate full-stack execution under a hard time limit, not
to replicate Google Docs' feature surface.

## Stack and why

**Next.js 15 (App Router) + MongoDB Atlas + Mongoose + TipTap + Tailwind,
deployed on Vercel.**

This is my existing MERN background, chosen deliberately to avoid paying
a learning-curve tax against the clock. Next.js's App Router lets
frontend and API routes live in one codebase and one deployment, which
matters more for a 4-hour build than for a long-lived product. MongoDB's
document model also maps naturally onto this domain — a document's rich
text content, title, and sharing list are one coherent record, not
several relational tables.

## What I prioritized, and why

1. **A working deployment, early.** A blank Next.js app was pushed to
   Vercel before any feature code existed, specifically to surface
   deployment/environment problems (env vars, DB network access) while
   there was still time to fix them — which paid off, since the first
   live deploy failed on MongoDB Atlas network access and needed a fix
   mid-build, not at the end.
2. **Core loop over surface area.** Auth → create/edit a document →
   persist → share → verify a second user can see it, was treated as
   the non-negotiable spine. Everything else (styling, file upload,
   tests, docs) was layered on only once that loop worked end to end.
3. **Server-side authorization, not just UI hiding.** Ownership and
   sharing checks are enforced in the API routes (`lib/documentAccess.ts`),
   not just by hiding buttons in the UI — a user who isn't an owner or
   collaborator gets a 403 from the API regardless of what the frontend
   shows.

## What I deliberately did not build

- **Real signup/authentication** — seeded users only. The assessment
  explicitly allows this, and building real auth (email verification,
  password reset, etc.) would have consumed hours better spent on the
  actual document product.
- **Granular sharing roles (view vs. edit)** — one sharing tier (edit
  access), since the brief asks for sharing that "demonstrates clear
  intent and working logic," not enterprise ACL.
- **Real-time collaborative editing (merge/conflict resolution)** — last
  save wins if two users edit simultaneously. A real implementation
  would need operational transforms or CRDTs (e.g. Yjs), a multi-day
  undertaking on its own.

## Optional stretch feature implemented

Began implementing the "real-time collaboration indicators" stretch
goal (presence model, heartbeat API route, avatar stack UI) but the
API route was not correctly created before the time limit, so it isn't
functional in the deployed build. Documenting this honestly rather
than claiming a feature that doesn't work, per the assessment's
guidance to state clearly what's working vs. incomplete.

## What I'd do next with more time (2–4 hours)

1. Move rate limiting to a shared store (Redis/Upstash) so limits hold
   across all Vercel serverless instances, not just one warm instance.
2. Add a view-only sharing tier, distinct from edit access.
3. Add optimistic UI feedback for the share panel (currently a full
   round-trip per toggle).
4. Expand test coverage to the API route layer itself (integration
   tests against a test database), not just the pure authorization
   function.
5. Add pagination to the "available users to share with" list, which
   currently loads every user — fine at seed-data scale, not at real scale.