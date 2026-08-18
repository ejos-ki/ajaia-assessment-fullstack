# AI Workflow Note

## Tools used

- **Claude** (chat) — primary pair-programming partner for the entire
  build: scaffolding, API routes, UI components, debugging, and this
  documentation.
- **VS Code** — editor, manual review and editing of all generated code.

## How I used it

Worked in a decomposed, sequential loop rather than one large prompt:
plan the feature → generate the piece → run it → verify in the browser
or via `tsc`/tests → commit → move to the next piece. Each layer (auth,
document CRUD, editor, sharing, upload) was built, tested, and committed
before starting the next, rather than generating the whole app at once
and debugging it as a block.

I kept a running build log (`notes.md`) throughout, noting each
significant decision or fix as it happened rather than reconstructing
it afterward — this document and the architecture note are distilled
from that log.

## Where AI materially sped things up

- Scaffolding boilerplate (Mongoose schemas, Next.js API route
  structure, TipTap wiring) that would otherwise be slow to hand-type
  correctly on the first try, especially with Next.js 15's newer
  async `params` API.
- Diagnosing a live deployment failure fast: given the exact Vercel
  function log stack trace (`MongooseServerSelectionError`), it was
  correctly traced to MongoDB Atlas network access rather than a code
  bug — saving what could have been a long guess-and-check cycle.
- Producing a working debounced auto-save pattern and an httpOnly-cookie
  JWT session setup correctly on the first pass — both are the kind of
  code that's easy to get subtly wrong by hand under time pressure.

## What I changed or rejected

- **Variable naming.** An early draft of the document API used
  short/acronym names (`doc`, `req`, `u`). I flagged this as unclear
  for a non-technical reviewer and had it refactored to full descriptive
  names (`document`, `request`, `collaboratorId`). This also fixed a
  real TypeScript type-narrowing bug that the ambiguous shape had caused
  — the fix wasn't just cosmetic.
- **Editor toolbar typing.** Initial code typed the toolbar's `editor`
  prop as `ReturnType<typeof useEditor>` implicitly assumed non-null;
  `tsc` caught that `useEditor()` can return `null` before it
  initializes. Fixed by typing it explicitly as `Editor | null` and
  keeping the existing null check — a real bug caught by tooling, not
  guesswork.
- **List/heading styling.** Generated CSS didn't account for Tailwind's
  preflight reset stripping default list markers — bullets and numbers
  weren't rendering despite correct underlying HTML. Caught by visual
  testing in the browser, fixed with scoped `.ProseMirror` CSS rather
  than pulling in the full Typography plugin (kept the footprint small
  for this scope).
- **Database network access.** Initial deployment assumption was that
  the MongoDB connection would "just work" on Vercel. It didn't — first
  live login attempt returned a 500. Read the actual Vercel function
  log rather than guessing, traced it to Atlas IP whitelisting, and
  fixed it with a documented, intentional tradeoff (`0.0.0.0/0`)
  rather than silently leaving it broken or undocumented.

## How I verified correctness

- Ran `npx tsc --noEmit` after every non-trivial change to catch type
  errors before runtime.
- Manually tested every feature in the browser as it was built: login,
  create/edit/save, refresh-persistence, upload, and the full two-user
  sharing flow (Alice shares → Bob sees it with correct permissions).
- Wrote and ran unit tests (`npm run test`) for the authorization logic
  specifically, since it's the most security-sensitive piece of logic
  in the app — 4 tests covering owner, shared collaborator, and
  unauthorized access, all passing.
- Verified the actual **live Vercel deployment**, not just localhost,
  including reading Vercel's function logs to diagnose the one real
  production-only failure that came up.

We are evaluating practical AI usage, not volume of AI usage: the
above reflects a real build where most of the code originated from AI
assistance, but every piece was run, read, tested, and in several
cases corrected before being committed.