#!/usr/bin/env node
/**
 * DAILY UPDATE PIPELINE
 * ---------------------
 * Run via cron once a day (e.g. 0 7 * * *) on a server:
 *     node scripts/daily-update.mjs
 *
 * What it does:
 *   1. Builds a date-stamped Current Affairs (PIB + govt) digest.
 *   2. Builds a date-stamped Vocabulary list (10 words/day).
 *   3. Writes JSON into /data/daily/<YYYY-MM-DD>.json
 *   4. Generates a printable HTML (PDF-ready) into /public/pdf/<YYYY-MM-DD>-{news|vocab}.html
 *   5. Updates /data/daily-index.json so the app lists all available dates.
 *
 * LIVE PIB FETCH (optional): set FETCH_LIVE=1 to pull from PIB RSS. Without network
 * (e.g. inside a sandbox) it falls back to the curated seed pools so the pipeline
 * always succeeds and the platform stays populated.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { VOCAB_POOL, NEWS_POOL } from "./lib/daily-content.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const DAILY_DIR = path.join(ROOT, "data", "daily");
const PDF_DIR = path.join(ROOT, "public", "pdf");
fs.mkdirSync(DAILY_DIR, { recursive: true });
fs.mkdirSync(PDF_DIR, { recursive: true });

const PIB_RSS = "https://pib.gov.in/RssMain.aspx?ModId=6&Lang=1&Regid=3"; // English, all-India

function fmt(d) {
  return d.toISOString().slice(0, 10);
}

// Deterministic daily rotation index from the date string.
function dayNumber(dateStr) {
  return Math.floor(new Date(dateStr).getTime() / 86400000);
}

async function fetchLivePIB() {
  if (process.env.FETCH_LIVE !== "1") return null;
  try {
    const res = await fetch(PIB_RSS, { headers: { "User-Agent": "Mozilla/5.0" } });
    if (!res.ok) throw new Error("HTTP " + res.status);
    const xml = await res.text();
    const items = [];
    const re = /<item>([\s\S]*?)<\/item>/g;
    let m;
    while ((m = re.exec(xml)) && items.length < 12) {
      const block = m[1];
      const t = (block.match(/<title>([\s\S]*?)<\/title>/) || [])[1] || "";
      const desc = (block.match(/<description>([\s\S]*?)<\/description>/) || [])[1] || "";
      const title = t.replace(/<!\[CDATA\[|\]\]>/g, "").trim();
      const summary = desc.replace(/<!\[CDATA\[|\]\]>/g, "").replace(/<[^>]+>/g, "").trim().slice(0, 400);
      if (title) items.push({ title, source: "PIB", category: "Current Affairs", summary, examPoint: "Note key names, schemes, dates and ministries." });
    }
    return items.length ? items : null;
  } catch (e) {
    console.warn("Live PIB fetch failed, using seed pool:", e.message);
    return null;
  }
}

function buildNews(dateStr, live) {
  const base = live || NEWS_POOL;
  const dn = dayNumber(dateStr);
  // rotate the seed pool so each day differs when offline
  const rotated = base.map((_, i) => base[(i + dn) % base.length]);
  return rotated.slice(0, Math.min(8, rotated.length)).map((n, i) => ({ ...n, id: `${dateStr}-news-${i + 1}` }));
}

function buildVocab(dateStr) {
  const dn = dayNumber(dateStr);
  const start = (dn * 10) % VOCAB_POOL.length;
  const words = [];
  for (let i = 0; i < 10; i++) words.push(VOCAB_POOL[(start + i) % VOCAB_POOL.length]);
  return words.map((w, i) => ({ ...w, id: `${dateStr}-vocab-${i + 1}` }));
}

function htmlDoc(title, bodyHtml) {
  // Self-contained, print-to-PDF friendly HTML (inline styles, no external assets).
  return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${title}</title>
<style>
@page{margin:18mm}
body{font-family:Georgia,'Times New Roman',serif;color:#1a1a1a;max-width:800px;margin:24px auto;padding:0 20px;line-height:1.55}
h1{font-size:24px;border-bottom:3px solid #1d4ed8;padding-bottom:8px;color:#1e3a8a}
h2{font-size:18px;color:#1e40af;margin-top:24px}
.brand{font-size:13px;color:#64748b;letter-spacing:1px;text-transform:uppercase}
.card{border:1px solid #e2e8f0;border-radius:8px;padding:14px 16px;margin:12px 0;background:#f8fafc}
.tag{display:inline-block;background:#1d4ed8;color:#fff;font-size:11px;padding:2px 8px;border-radius:10px;margin-right:6px;font-family:Arial,sans-serif}
.word{font-size:18px;font-weight:bold;color:#0f172a}
.pos{font-style:italic;color:#64748b}
.muted{color:#475569;font-size:14px}
.exam{background:#fef3c7;border-left:4px solid #f59e0b;padding:6px 10px;margin-top:8px;font-size:13px;font-family:Arial,sans-serif}
.foot{margin-top:30px;border-top:1px solid #e2e8f0;padding-top:10px;font-size:12px;color:#94a3b8;text-align:center}
@media print{.noprint{display:none}}
</style></head><body>
<div class="noprint" style="text-align:right;margin-bottom:10px"><button onclick="window.print()" style="padding:8px 16px;background:#1d4ed8;color:#fff;border:0;border-radius:6px;cursor:pointer;font-family:Arial">Download / Print PDF</button></div>
${bodyHtml}
<div class="foot">SSC CGL Prep — Auto-generated daily content. Verify facts with official sources (pib.gov.in).</div>
</body></html>`;
}

function newsHtml(dateStr, news) {
  const items = news
    .map(
      (n) => `<div class="card"><span class="tag">${n.source}</span><span class="tag" style="background:#0891b2">${n.category}</span>
  <h2 style="margin:8px 0 4px">${n.title}</h2>
  <div class="muted">${n.summary}</div>
  <div class="exam"><b>Exam point:</b> ${n.examPoint}</div></div>`
    )
    .join("");
  return htmlDoc(
    `Current Affairs ${dateStr}`,
    `<div class="brand">SSC CGL • Daily Current Affairs</div><h1>Current Affairs — ${dateStr}</h1>${items}`
  );
}

function vocabHtml(dateStr, vocab) {
  const items = vocab
    .map(
      (w) => `<div class="card"><div class="word">${w.word} <span class="pos">(${w.pos})</span></div>
  <div class="muted"><b>Meaning:</b> ${w.meaning}</div>
  <div class="muted"><b>Synonyms:</b> ${w.synonyms.join(", ")} &nbsp; <b>Antonyms:</b> ${w.antonyms.join(", ")}</div>
  <div class="muted"><i>"${w.sentence}"</i></div></div>`
    )
    .join("");
  return htmlDoc(
    `Vocabulary ${dateStr}`,
    `<div class="brand">SSC CGL • Daily Vocabulary</div><h1>Vocabulary — ${dateStr}</h1>${items}`
  );
}

async function generateForDate(dateStr, live) {
  const news = buildNews(dateStr, live);
  const vocab = buildVocab(dateStr);
  const payload = { date: dateStr, news, vocab };
  fs.writeFileSync(path.join(DAILY_DIR, `${dateStr}.json`), JSON.stringify(payload));
  fs.writeFileSync(path.join(PDF_DIR, `${dateStr}-news.html`), newsHtml(dateStr, news));
  fs.writeFileSync(path.join(PDF_DIR, `${dateStr}-vocab.html`), vocabHtml(dateStr, vocab));
  return payload;
}

async function main() {
  const live = await fetchLivePIB();
  // Backfill: generate today + previous N days so previous-date PDFs are available.
  const N = Number(process.env.BACKFILL_DAYS || 14);
  const today = new Date();
  const dates = [];
  for (let i = 0; i < N; i++) {
    const d = new Date(today);
    d.setUTCDate(d.getUTCDate() - i);
    dates.push(fmt(d));
  }
  for (const ds of dates) {
    await generateForDate(ds, live);
  }
  // Build index (newest first), only for dates we actually have files for.
  const files = fs
    .readdirSync(DAILY_DIR)
    .filter((f) => f.endsWith(".json"))
    .map((f) => f.replace(".json", ""))
    .sort()
    .reverse();
  const index = files.map((date) => ({
    date,
    newsPdf: `/pdf/${date}-news.html`,
    vocabPdf: `/pdf/${date}-vocab.html`,
  }));
  fs.writeFileSync(path.join(ROOT, "data", "daily-index.json"), JSON.stringify(index, null, 2));
  console.log(`Daily content generated for ${dates.length} dates. Latest: ${files[0]}. Live PIB: ${live ? "yes" : "no (seed)"}`);
}

main();
