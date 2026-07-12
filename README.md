# CVCraft AI — V1

Monorepo for CVCraft AI: a resume + cover letter builder with ATS-friendly
templates, one-click PDF export, and AI-assisted writing. **V1 is entirely
free** — no plan limits, no locked templates, no billing.

## Folder structure

```
cvcraft-ai/
├── backend/                 Node.js + Express API
│   ├── src/
│   │   ├── config/           Supabase admin client, OpenRouter client
│   │   ├── controllers/      Route handler logic (auth, resumes, cover letters, ai)
│   │   ├── middleware/       requireAuth (verifies Supabase JWT)
│   │   ├── routes/           Express routers
│   │   ├── utils/             AI prompt builders
│   │   ├── app.js            Express app (middleware + route wiring)
│   │   └── server.js         Entry point
│   └── .env.example
│
├── frontend/                 React + Vite + Tailwind
│   ├── src/
│   │   ├── components/
│   │   │   ├── builder/       Resume builder sections (personal info, experience, etc.)
│   │   │   ├── dashboard/      ResumeCard (rename/duplicate/delete)
│   │   │   ├── layout/         Navbar
│   │   │   ├── preview/        Live preview + the 3 templates
│   │   │   └── ui/             Input, Button, Card, Textarea — shared primitives
│   │   ├── context/           AuthContext (Supabase session + profile)
│   │   ├── lib/                supabaseClient.js, api.js, ai.js, pdf.js, format.js
│   │   ├── pages/              Landing, Register, Login, ForgotPassword, Dashboard,
│   │   │                       Builder, CoverLetters, CoverLetterEditor, Settings
│   │   ├── routes/             ProtectedRoute
│   │   ├── App.jsx             Route definitions
│   │   └── main.jsx            React entry point
│   └── .env.example
│
└── database/
    └── schema.sql             Full Postgres schema + Row Level Security policies
```

## What's built (V1 — complete)

- ✅ Database schema (Supabase/Postgres) for every entity in the PRD: profiles,
  resumes, personal_info, experience, education, skills, languages,
  certifications, projects, references, cover_letters — with Row Level
  Security so users can only ever touch their own data.
- ✅ Auth: register, login, forgot password, change password, update profile,
  delete account (cascades and removes all resumes/cover letters), protected
  routes.
- ✅ Resumes API: list (with search), get one (with all sections), create,
  update (including nested sections), soft delete, duplicate. **No limits —
  unlimited resumes for every user.**
- ✅ Dashboard: total resumes, last edited, search, create-new, rename,
  duplicate, delete — all inline on the resume cards.
- ✅ Full resume builder: personal info, professional summary, work
  experience, education, skills (chips), languages, certifications,
  projects, references — all repeatable where relevant — with a live
  preview that updates as you type.
- ✅ 3 templates (Classic, Modern, Minimal), **all free**, switchable from
  the builder.
- ✅ One-click PDF export (client-side, via html2pdf.js) for both resumes
  and cover letters.
- ✅ Cover letter builder: company, position, hiring manager, letter body,
  with a live document-style preview, list/create/delete.
- ✅ Settings: update profile, change password, delete account.
- ✅ **AI writing assistant** (free for every user):
  - **"✨ Generate with AI"** next to the resume's Professional Summary —
    uses whatever title/experience/education/skills are already filled in
    to draft a tailored summary.
  - **"✨ Generate with AI"** on the cover letter body — pulls context from
    the user's most recently edited resume (skills, experience, summary)
    plus the job's company/position/hiring manager to draft a tailored
    cover letter.
  - Both are powered by an LLM via [OpenRouter](https://openrouter.ai)
    (defaults to Claude, configurable to any model OpenRouter offers) — see
    setup below.

## What's next (parked for later)

- **Premium tier / billing** — a full version of this (resume limits,
  locked templates, real Stripe Checkout + Customer Portal + webhooks) was
  built and then intentionally removed for V1 per a scope decision to keep
  V1 entirely free. It's straightforward to re-add later: reintroduce plan
  checks in `resumes.controller.js`, restore a `billing.controller.js` /
  `billing.routes.js` pair using the Stripe SDK, and add the Plan card back
  to Settings.
- More AI features (ATS score, job-description matching, grammar check,
  bullet-point rewriter).
- Admin dashboard (usage stats, active users).
- Email verification flow (currently auto-confirmed for simplicity in dev —
  toggle "Confirm email" in Supabase Auth settings to require it).

## Setup

### 1. Supabase project

1. Create a project at [supabase.com](https://supabase.com).
2. In the SQL editor, run `database/schema.sql`.
3. Grab your Project URL, `anon` public key, and `service_role` key from
   Settings → API.

### 2. OpenRouter API key (for the AI features)

1. Create an account at [openrouter.ai](https://openrouter.ai) if you don't
   have one.
2. Go to [openrouter.ai/keys](https://openrouter.ai/keys) → Create Key,
   copy it (starts with `sk-or-v1-...`).
3. Put it in `backend/.env` as `OPENROUTER_API_KEY`.
4. Add credit under [openrouter.ai/credits](https://openrouter.ai/credits) —
   usage is pay-as-you-go and a resume summary or cover letter draft costs
   a small fraction of a cent with the default model.
5. (Optional) `OPENROUTER_MODEL` in `.env` lets you pick any model listed
   at [openrouter.ai/models](https://openrouter.ai/models) — e.g. swap to
   `openai/gpt-4o-mini` or `meta-llama/llama-3.1-70b-instruct` without
   touching any code. Defaults to `anthropic/claude-sonnet-4.5` if not set.

If you skip this step, the rest of the app works fine — only the "Generate
with AI" buttons will show an error until a key is added.

### 3. Backend

```bash
cd backend
cp .env.example .env   # fill in SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY, OPENROUTER_API_KEY
npm install
npm run dev             # http://localhost:4000
```

### 4. Frontend

```bash
cd frontend
cp .env.example .env   # fill in VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY
npm install
npm run dev             # http://localhost:5173
```

### 5. Try it

1. Visit `http://localhost:5173`, click "Get started", register an account.
2. Create a resume, fill in a professional title and at least one work
   experience entry, then click **"✨ Generate with AI"** next to the
   Professional Summary field.
3. Create a cover letter, fill in company/position, and click **"✨
   Generate with AI"** on the Letter card — it'll pull in the skills/
   experience from the resume you just built.

## How the AI feature works

- `backend/src/controllers/ai.controller.js` exposes two endpoints:
  `POST /api/ai/summary` and `POST /api/ai/cover-letter`. Both take
  whatever data the frontend currently has in memory (no need to save
  first) and return generated text — nothing is stored server-side beyond
  the single request.
- `backend/src/utils/aiPrompts.js` builds the actual prompts sent to the
  model. The prompts explicitly instruct it not to invent employers,
  numbers, or achievements beyond what the user provided — it's meant to
  help find the right words for real experience, not fabricate a résumé.
- `backend/src/config/openrouter.js` lazily creates an OpenAI SDK client
  pointed at OpenRouter's OpenAI-compatible endpoint
  (`https://openrouter.ai/api/v1`) — the server still boots fine without
  `OPENROUTER_API_KEY` set; only the AI endpoints will return a clear error
  until it's configured. Since OpenRouter is a router across many
  providers, switching models (Claude, GPT, Llama, etc.) is just an env
  var change (`OPENROUTER_MODEL`) — no code changes needed.

## Notes on the auth design

- The **frontend** talks to Supabase Auth directly (via `supabase-js`) for
  sign up / sign in / sign out / password reset — this is the standard,
  simplest pattern with Supabase and avoids passing raw passwords through
  our own API.
- The **backend** also exposes `/api/auth/*` equivalents (used for
  server-side/admin flows, e.g. `register` uses the service role key so
  email confirmation can be toggled centrally) and, more importantly,
  `middleware/auth.js` which verifies the Supabase access token on every
  protected API request and builds a per-request Supabase client scoped to
  that user's JWT — so Row Level Security applies to every query, and the
  backend never has to manually check "does this row belong to this user."
#   C V - C r a f t - A I  
 