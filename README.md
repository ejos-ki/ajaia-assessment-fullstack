# Ajaia Docs — AI-Native Full Stack Assessment

A lightweight, Google-Docs-style collaborative document editor: rich text
editing, file upload, and simple sharing between users.

**Live deployment:** https://ajaia-assessment-fullstack.vercel.app

---

## Test accounts

No public signup — accounts are seeded. Use either:

| Email | Password |
|---|---|
| `alice@example.com` | `password123` |
| `bob@example.com` | `password123` |

To see the sharing flow: log in as Alice, create a document, click **Share**,
toggle Bob on. Log out, log in as Bob — the document appears on his
dashboard with edit access (no delete/share controls, since he's not
the owner).

---

## Tech stack

- **Frontend/Backend:** Next.js 15 (App Router) — single codebase for UI and API routes
- **Database:** MongoDB Atlas (free tier) via Mongoose
- **Editor:** TipTap (rich text)
- **Styling:** Tailwind CSS
- **Auth:** Seeded users, JWT session in an httpOnly cookie
- **Deployment:** Vercel

---

## Running locally

### Prerequisites
- Node.js 18+
- A MongoDB connection string (Atlas free tier or local MongoDB)

### Setup

```bash
git clone https://github.com/ejos-ki/ajaia-assessment-fullstack
cd ajaia-assessment-fullstack
npm install
```

Create a `.env.local` file in the project root:

```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=any_long_random_string
```

Generate a `JWT_SECRET` quickly with:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Seed the two test accounts:

```bash
npm run seed
```

Run the app:

```bash
npm run dev
```

Visit `http://localhost:3000` — you'll be redirected to `/login`.

### Running tests

```bash
npm run test
```

---

## Features

- **Rich text editing** — bold, italic, underline, headings, bulleted and
  numbered lists. Auto-saves ~1 second after you stop typing.
- **File upload** — upload a `.txt` or `.md` file to create a new document
  from its content. **Only `.txt` and `.md` are supported** (max 1MB);
  other file types are rejected with a clear error message.
- **Sharing** — the document owner can share with one or more other
  seeded users, granting edit access. Only the owner can delete a
  document or manage its sharing.
- **Persistence** — documents and sharing state persist in MongoDB;
  content and formatting survive a refresh.

---

## Known limitations

See `notes.md` / the architecture note for the full list. Highlights:

- No rate limiting on the login endpoint.
- Sharing is single-tier (editor access only, no view-only role).
- No real-time collaboration — last save wins if two users edit at once.
- MongoDB Atlas network access is set to allow all IPs, since Vercel's
  serverless functions don't have a static IP on the free tier. Access
  still requires valid database credentials.

## What I'd build next with more time

See the architecture note for prioritization details.