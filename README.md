# SSC CGL Prep Platform

A complete SSC CGL Tier-1 preparation web app built with **Next.js**, aligned to the
**latest SSC CGL 2025 notification** pattern (Tier-1: 100 Q · 200 marks · 60 min · −0.5 negative · +2 correct).

## What's inside

| Feature | Details |
|---|---|
| **Full-length mocks** | 25 mocks × 100 questions (25 each in Reasoning, GA, Quant, English) with timer, question palette, sectional timing guide, negative marking & section-wise score breakdown |
| **Sectional tests** | 50 timed tests (25 Q · 15 min) across the four sections |
| **Topic-wise practice** | 38 topics × 200 questions each (~7,600 Q) with **Timed Test** and **Learn** modes, full solutions |
| **Daily Current Affairs** | PIB & government-source digest, date-wise, with printable/downloadable PDF for every date (including past dates) |
| **Daily Vocabulary** | 10 most-probable CGL words/day (meaning, synonyms, antonyms, usage), date-wise PDFs |
| **User login + Analytics** | Sign up/login, every attempt saved, dashboard with accuracy trend, section/topic breakdown, strengths & weak areas, full history |
| **Exam Info** | Latest Tier-1 & Tier-2 pattern, marking scheme, full syllabus & key dates |

**Total question bank: ~11,350** (2,500 mock + 1,250 sectional + ~7,600 topic). Every question has a worked explanation.
The English & GA pools are large, curated and exam-vetted, giving thousands of unique items.

## Run locally

```bash
npm install
npm run gen:questions   # builds the question banks into /data
npm run daily:update    # builds daily CA + vocab + PDFs (last 14 days)
npm run dev             # http://localhost:3000
```

For production: `npm run build && npm run start`

## 🚀 Deploy
See **[DEPLOYMENT.md](./DEPLOYMENT.md)** for step-by-step Vercel / Netlify / Docker
instructions. TL;DR: push to GitHub → import on Vercel → done. Daily updates run via
the included GitHub Actions workflow (and optional Vercel cron).

## User login & performance analytics
- `/login` — sign up / login. Accounts + attempt history are stored in the browser
  (localStorage) by default, so it works on any static/zero-backend host.
- `/dashboard` — accuracy trend chart, average score, section-wise accuracy,
  topic-wise table, auto-detected **strengths** & **focus areas**, and full attempt history.
- **Multi-device sync (optional):** follow `lib/backend-adapter.example.js` to plug in
  Supabase (SQL + auth provided) and swap the store functions.

## Daily auto-update (news + vocabulary)
`scripts/daily-update.mjs` generates a date-stamped Current-Affairs digest and a
Vocabulary list, writes JSON to `data/daily/<date>.json`, and produces print-ready
PDF (HTML) files in `public/pdf/`. It refreshes `data/daily-index.json` so the app
lists every available date.

- **Live PIB:** `FETCH_LIVE=1 node scripts/daily-update.mjs` pulls the live PIB RSS feed.
  Without network it falls back to a curated rotating pool (never fails).
- **Backfill depth:** `BACKFILL_DAYS=N` (default 14).
- **Automation:**
  - GitHub Actions: `.github/workflows/daily-update.yml` (daily, commits + redeploys)
  - Vercel Cron: `vercel.json` → `/api/cron/daily` (dispatches the Action)
  - Self-host: `deploy/crontab.example`

## How the question bank scales to full volume
Questions come from deterministic, **math-correct generators** in `scripts/lib/`
(one module per subject) plus large **curated pools** for English & GA. Each item has
a question, verified answer, plausible distractors, and a step-by-step explanation.
The generator de-duplicates within each bank.

- Raise `PER_TOPIC` in `scripts/generate-questions.mjs` for bigger banks.
- Append entries to the arrays in `gen-english.mjs` / `gen-ga.mjs` to add more unique,
  exam-relevant items, then re-run `npm run gen:questions`.

## Project structure
```
app/                 Routes: mocks, sectional, topics, current-affairs, vocabulary,
                     exam-info, login, dashboard, api/cron/daily
components/          QuizEngine, TopicPractice, DailyView, NavBar, AuthProvider
lib/                 data.js (server loaders), store.js (auth+analytics), labels.js
scripts/
  lib/              RNG + per-subject generators + daily content pool
  generate-questions.mjs   Builds /data question banks
  daily-update.mjs         Builds daily CA + vocab + PDFs (cron-ready)
.github/workflows/  daily-update.yml, deploy.yml
deploy/             crontab.example
data/               Generated JSON banks + daily/ + indexes
public/pdf/         Generated date-wise PDF (HTML) files
Dockerfile, vercel.json
```

## Disclaimer
Current-affairs and GK facts should always be cross-checked with official sources
(**pib.gov.in**, **ssc.gov.in**). Exam dates shown are from the 2025 cycle for reference.
