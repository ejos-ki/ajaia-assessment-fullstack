# Submission — Ajaia AI-Native Full Stack Developer Assessment

**Candidate:** Jeo D. Latorre
**Live product URL:** [add Vercel URL]
**Repository:** [add GitHub URL]
**Walkthrough video:** [add unlisted YouTube/Loom URL]

---

## Test accounts

| Email | Password |
|---|---|
| `alice@example.com` | `password123` |
| `bob@example.com` | `password123` |

---

## What's included in this folder

- `/source-code/` — full Next.js application source (or: link to GitHub
  repo, if not duplicating the code into Drive)
- `README.md` — setup and local run instructions, tech stack, test
  credentials, feature summary
- `ARCHITECTURE.md` — architecture note: what was prioritized, what was
  deliberately left out, and why
- `AI_WORKFLOW.md` — AI workflow note: tools used, what sped up the
  build, what was changed or rejected from AI-generated output, how
  correctness was verified
- `submission.md` — this file
- `walkthrough-video-link.txt` — plain text file containing the video URL
- `notes.md` — full build log kept during development (optional/bonus:
  raw, unedited process notes behind the polished docs above)

---

## Feature status

| Feature | Status |
|---|---|
| Rich text editing (bold, italic, underline, headings, lists) | Complete |
| File upload (.txt/.md → new document) | Complete |
| Sharing (owner shares with one or more collaborators) | Complete |
| Persistence (MongoDB) | Complete |
| Auth (seeded users, JWT session) | Complete |
| Automated test | Complete (4 unit tests on authorization logic) |
| Live deployment | Complete, verified on live URL (not just localhost) |

## What's incomplete / next steps

See "What I'd do next with more time" in `ARCHITECTURE.md`. In short:
rate limiting on login, a view-only sharing tier, and API-layer
integration tests were deprioritized in favor of a complete, verified
core product within the time limit.