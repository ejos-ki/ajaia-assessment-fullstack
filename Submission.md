# Submission — Ajaia AI-Native Full Stack Developer Assessment

**Candidate:** Jeo D. Latorre
**Live product URL:** https://ajaia-assessment-fullstack.vercel.app
**Repository:** https://github.com/ejos-ki/ajaia-assessment-fullstack
**Walkthrough video:** [add video URL after recording]

---

## Test accounts

| Email | Password |
|---|---|
| `alice@example.com` | `password123` |
| `bob@example.com` | `password123` |

To see the sharing flow: log in as Alice, create a document, click Share, toggle Bob on. Log out, log in as Bob — the document appears on his dashboard with edit access.

---

## What's included in this repository

- Full Next.js application source code
- `README.md` — setup and local run instructions, tech stack, test credentials, feature summary
- `Architecture.md` — architecture note: what was prioritized, what was deliberately left out, and why
- `AIWorkflow.md` — AI workflow note: tools used, what sped up the build, what was changed or rejected from AI-generated output
- `Submission.md` — this file
- `notes.md` — full build log kept during development

---

## Feature status

| Feature | Status |
|---|---|
| Rich text editing (bold, italic, underline, headings, lists) | Complete |
| File upload (.txt/.md → new document) | Complete |
| Sharing (owner shares with one or more collaborators) | Complete |
| Persistence (MongoDB) | Complete |
| Auth (seeded users, JWT session) | Complete |
| Rate limiting on login | Complete (in-memory, IP-based) |
| Presence indicators (optional stretch) | Complete (polling-based avatar stack) |
| Automated test | Complete (4 unit tests on authorization logic) |
| Live deployment | Complete, verified on live URL |

## What's incomplete / next steps

Real-time collaborative editing (operational transforms/CRDTs) was
deliberately not attempted — multi-day scope on its own. A view-only
sharing tier and API-layer integration tests were also deprioritized.
See `Architecture.md` for full reasoning.