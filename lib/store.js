"use client";
// Client-side persistence for auth + attempt history + analytics.
// Uses localStorage so it works on any static host (per-device/per-browser).
// Swappable: replace the read/write helpers with API calls to use a real backend.

const USER_KEY = "sscprep:user";
const attemptsKey = (email) => `sscprep:attempts:${email || "guest"}`;

function safeParse(json, fallback) {
  try {
    return JSON.parse(json) ?? fallback;
  } catch {
    return fallback;
  }
}

// ---- Auth (lightweight; passwords hashed client-side, not for real security) ----
async function hash(str) {
  if (typeof crypto !== "undefined" && crypto.subtle) {
    const data = new TextEncoder().encode(str);
    const buf = await crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
  }
  return btoa(str);
}

const usersKey = "sscprep:users";

export async function registerUser(name, email, password) {
  const users = safeParse(localStorage.getItem(usersKey), {});
  if (users[email]) throw new Error("An account with this email already exists.");
  users[email] = { name, email, pass: await hash(password), createdAt: Date.now() };
  localStorage.setItem(usersKey, JSON.stringify(users));
  return loginUser(email, password);
}

export async function loginUser(email, password) {
  const users = safeParse(localStorage.getItem(usersKey), {});
  const u = users[email];
  if (!u) throw new Error("No account found. Please sign up first.");
  if (u.pass !== (await hash(password))) throw new Error("Incorrect password.");
  const session = { name: u.name, email: u.email };
  localStorage.setItem(USER_KEY, JSON.stringify(session));
  return session;
}

export function getCurrentUser() {
  if (typeof window === "undefined") return null;
  return safeParse(localStorage.getItem(USER_KEY), null);
}

export function logoutUser() {
  localStorage.removeItem(USER_KEY);
}

// ---- Attempts / progress ----
export function getAttempts(email) {
  if (typeof window === "undefined") return [];
  return safeParse(localStorage.getItem(attemptsKey(email)), []);
}

export function saveAttempt(email, attempt) {
  const list = getAttempts(email);
  list.unshift({ ...attempt, id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, at: Date.now() });
  // keep last 500
  localStorage.setItem(attemptsKey(email), JSON.stringify(list.slice(0, 500)));
  return list;
}

export function clearAttempts(email) {
  localStorage.removeItem(attemptsKey(email));
}

// ---- Analytics derivation ----
export function computeAnalytics(attempts) {
  const total = attempts.length;
  if (!total) {
    return { total: 0 };
  }
  let sumAcc = 0, sumScore = 0, sumMax = 0, totalCorrect = 0, totalWrong = 0, totalSkipped = 0, totalQ = 0, totalTimeSec = 0;
  const byType = {};
  const bySection = {}; // section -> {correct,wrong,skipped,total}
  const byTopic = {};
  for (const a of attempts) {
    sumAcc += a.accuracy || 0;
    sumScore += a.score || 0;
    sumMax += a.max || 0;
    totalCorrect += a.correct || 0;
    totalWrong += a.wrong || 0;
    totalSkipped += a.skipped || 0;
    totalQ += a.totalQuestions || 0;
    totalTimeSec += a.timeSpentSec || 0;
    byType[a.type] = (byType[a.type] || 0) + 1;
    if (a.perSection) {
      for (const [sec, v] of Object.entries(a.perSection)) {
        const s = (bySection[sec] = bySection[sec] || { correct: 0, wrong: 0, skipped: 0, total: 0 });
        s.correct += v.correct; s.wrong += v.wrong; s.skipped += v.skipped; s.total += v.total;
      }
    }
    if (a.perTopic) {
      for (const [t, v] of Object.entries(a.perTopic)) {
        const s = (byTopic[t] = byTopic[t] || { correct: 0, wrong: 0, total: 0 });
        s.correct += v.correct; s.wrong += v.wrong; s.total += v.total;
      }
    }
  }
  const sectionAcc = Object.fromEntries(
    Object.entries(bySection).map(([k, v]) => [k, v.correct + v.wrong ? Math.round((v.correct / (v.correct + v.wrong)) * 100) : 0])
  );
  // strengths & weaknesses by topic (min 3 attempts at topic)
  const topicScores = Object.entries(byTopic)
    .filter(([, v]) => v.total >= 3)
    .map(([t, v]) => ({ topic: t, acc: v.correct + v.wrong ? Math.round((v.correct / (v.correct + v.wrong)) * 100) : 0, total: v.total }))
    .sort((a, b) => b.acc - a.acc);

  // trend: last 10 attempts accuracy
  const trend = attempts.slice(0, 10).reverse().map((a) => ({ at: a.at, accuracy: a.accuracy || 0, title: a.title }));

  return {
    total,
    avgAccuracy: Math.round(sumAcc / total),
    avgScorePct: sumMax ? Math.round((sumScore / sumMax) * 100) : 0,
    totalCorrect, totalWrong, totalSkipped, totalQ,
    totalTimeMin: Math.round(totalTimeSec / 60),
    byType, bySection, sectionAcc, byTopic,
    strengths: topicScores.slice(0, 5),
    weaknesses: topicScores.slice(-5).reverse(),
    trend,
  };
}
