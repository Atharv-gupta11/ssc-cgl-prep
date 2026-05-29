# 🚀 Deployment Guide — SSC CGL Prep

This app is a **Next.js 14** site. The easiest, free, production-grade path is **Vercel**
(made by the Next.js team). Two other paths (Netlify and self-hosted VPS/Docker) are
also documented. Pick **one**.

> **Can you (the assistant) deploy it for me?**
> I can't click through Vercel/GitHub's login or enter your credit-card-free signup on
> your behalf from here (no access to your accounts/secrets). But I've done **all** the
> setup so deployment is just a few copy-paste commands. Follow **Option A** and you'll
> be live in ~5 minutes. If you paste me any error output, I'll fix it immediately.

---

## Prerequisites (once)
- A free **GitHub** account → https://github.com/signup
- A free **Vercel** account → https://vercel.com/signup (sign in *with GitHub* — easiest)
- **Git** + **Node 20+** installed locally (`node -v`, `git --version`)

---

## Option A — Vercel via GitHub (recommended)

### 1. Put the code on GitHub
From the project folder (`/home/user`):
```bash
git init
git add .
git commit -m "SSC CGL Prep platform"
gh repo create ssc-cgl-prep --public --source=. --push   # if you have GitHub CLI
# — OR — create an empty repo on github.com, then:
git remote add origin https://github.com/<you>/ssc-cgl-prep.git
git branch -M main
git push -u origin main
```

### 2. Import into Vercel
1. Go to https://vercel.com/new
2. Click **Import** next to your `ssc-cgl-prep` repo.
3. Framework preset is auto-detected as **Next.js**. Leave defaults.
   (Build command is already set in `vercel.json`.)
4. Click **Deploy**. Done — you'll get a live URL like `https://ssc-cgl-prep.vercel.app`.

### 3. Turn on the daily auto-update (PIB + vocabulary)
You already have **two** mechanisms; enable whichever you prefer:

**(i) GitHub Actions (zero extra config, works immediately):**
The workflow `.github/workflows/daily-update.yml` runs every day at 01:45 UTC,
fetches live PIB, commits the new date's content + PDFs, and the push auto-triggers
a Vercel redeploy. Just make sure Actions are enabled (Repo → **Settings → Actions →
Allow all actions**).

**(ii) Vercel Cron (optional, pokes GitHub):**
`vercel.json` already declares a cron hitting `/api/cron/daily`. To use it, add these
Project → **Settings → Environment Variables** in Vercel:
| Name | Value |
|---|---|
| `CRON_SECRET` | any long random string |
| `GH_DISPATCH_TOKEN` | a GitHub PAT with `actions:write` |
| `GH_REPO` | `<you>/ssc-cgl-prep` |

That's it. New current-affairs & vocabulary appear daily, with date-wise PDF downloads,
and history is preserved in the repo.

---

## Option B — Netlify
1. Push to GitHub (step A.1 above).
2. https://app.netlify.com → **Add new site → Import** → pick the repo.
3. Build command: `node scripts/generate-questions.mjs && node scripts/daily-update.mjs && next build`
   Publish directory: `.next` (Netlify's Next plugin handles this automatically).
4. Deploy. Use the included GitHub Actions workflow for the daily cron (same as A.3-i).

---

## Option C — Self-hosted (VPS / Docker)

### Plain VPS (Ubuntu) with pm2
```bash
git clone https://github.com/<you>/ssc-cgl-prep.git /opt/ssc-cgl-prep
cd /opt/ssc-cgl-prep
npm ci
node scripts/generate-questions.mjs
node scripts/daily-update.mjs
npm run build
npm i -g pm2
pm2 start "npm run start" --name ssc-cgl-prep
pm2 save && pm2 startup
```
Then add the daily cron from `deploy/crontab.example` (`crontab -e`).

### Docker
```bash
docker build -t ssc-cgl-prep .
docker run -p 3000:3000 ssc-cgl-prep
```
For daily updates in Docker, run the cron on the host and `docker exec` the update,
or rebuild the image daily via your CI.

---

## Verifying a deploy
- Open `/` → stats load.
- `/mocks/mock-1` → start a mock, submit, see scorecard.
- `/current-affairs` and `/vocabulary` → switch dates, click **Download PDF**.
- `/login` → sign up, take a test, open `/dashboard` → analytics populate.

## Notes
- **Auth/progress** are stored in the browser (localStorage) by default — perfect for a
  single device and zero-backend hosting. For multi-device sync, follow
  `lib/backend-adapter.example.js` (Supabase) — ~20 minutes.
- Always re-verify GK/current-affairs facts against official sources
  (**pib.gov.in**, **ssc.gov.in**).
