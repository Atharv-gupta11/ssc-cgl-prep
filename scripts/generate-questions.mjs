import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { makeRng } from "./lib/rng.mjs";
import { SECTIONS } from "./lib/subjects.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, "..", "data");
fs.mkdirSync(OUT, { recursive: true });

let GID = 0;
function nextId(prefix) {
  GID += 1;
  return `${prefix}-${GID}`;
}

// Generate `count` questions for a section, cycling its topics evenly.
// Deduplicates by question text where possible (retries up to `maxTries`).
function genForSection(section, count, seed, dedupe = false) {
  const rng = makeRng(seed);
  const out = [];
  const seen = new Set();
  for (let i = 0; i < count; i++) {
    const topic = section.topics[i % section.topics.length];
    let item = section.gen(topic, rng);
    if (dedupe) {
      let tries = 0;
      while (seen.has(item.question) && tries < 40) {
        item = section.gen(topic, rng);
        tries++;
      }
      seen.add(item.question);
    }
    out.push({
      id: nextId(section.id),
      section: section.id,
      ...item,
      difficulty: ["Easy", "Medium", "Medium", "Hard"][i % 4],
    });
  }
  return out;
}

// ---------- 1. TOPIC-WISE BANKS: 200 questions per topic ----------
const PER_TOPIC = 200;
const topicBanks = {};
const topicIndex = [];
let seedCounter = 1000;

for (const section of SECTIONS) {
  topicBanks[section.id] = {};
  for (const topic of section.topics) {
    const qs = genForSection({ ...section, topics: [topic] }, PER_TOPIC, seedCounter++, true);
    topicBanks[section.id][topic] = qs;
    const uniqueQ = new Set(qs.map((q) => q.question)).size;
    topicIndex.push({
      section: section.id,
      sectionName: section.name,
      topic,
      slug: `${section.id}__${topic.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
      count: qs.length,
      uniqueQuestions: uniqueQ,
    });
  }
}

fs.writeFileSync(path.join(OUT, "topic-banks.json"), JSON.stringify(topicBanks));
fs.writeFileSync(path.join(OUT, "topic-index.json"), JSON.stringify(topicIndex, null, 2));

// ---------- 2. FULL-LENGTH MOCKS: 25 mocks x 100 Q (25 per section) ----------
const mocks = [];
const mockIndex = [];
for (let m = 1; m <= 25; m++) {
  const questions = [];
  for (const section of SECTIONS) {
    const qs = genForSection(section, section.perSection, 5000 + m * 13 + SECTIONS.indexOf(section), true);
    questions.push(...qs.map((q) => ({ ...q, id: `mock${m}-${q.id}` })));
  }
  const mock = {
    id: `mock-${m}`,
    title: `SSC CGL Tier-1 Full Mock Test ${m}`,
    type: "full",
    totalQuestions: questions.length,
    totalMarks: questions.length * 2,
    durationMin: 60,
    sectionTiming: SECTIONS.map((s) => ({ section: s.id, name: s.short, minutes: 15, questions: s.perSection })),
    negativePerWrong: 0.5,
    markPerCorrect: 2,
    questions,
  };
  mocks.push(mock);
  mockIndex.push({ id: mock.id, title: mock.title, totalQuestions: mock.totalQuestions, durationMin: mock.durationMin, totalMarks: mock.totalMarks });
}
fs.writeFileSync(path.join(OUT, "mocks.json"), JSON.stringify(mocks));
fs.writeFileSync(path.join(OUT, "mock-index.json"), JSON.stringify(mockIndex, null, 2));

// ---------- 3. SECTIONAL TESTS: 50 tests with sectional timing ----------
const sectional = [];
const sectionalIndex = [];
const distribution = [13, 13, 12, 12];
let stCount = 0;
for (let si = 0; si < SECTIONS.length; si++) {
  const section = SECTIONS[si];
  for (let k = 1; k <= distribution[si]; k++) {
    stCount++;
    const qs = genForSection(section, 25, 8000 + stCount * 17, true);
    const test = {
      id: `sectional-${stCount}`,
      title: `${section.short} Sectional Test ${k}`,
      type: "sectional",
      section: section.id,
      sectionName: section.name,
      totalQuestions: qs.length,
      totalMarks: qs.length * 2,
      durationMin: 15,
      negativePerWrong: 0.5,
      markPerCorrect: 2,
      questions: qs.map((q) => ({ ...q, id: `st${stCount}-${q.id}` })),
    };
    sectional.push(test);
    sectionalIndex.push({ id: test.id, title: test.title, section: test.section, sectionName: test.sectionName, totalQuestions: test.totalQuestions, durationMin: test.durationMin });
  }
}
fs.writeFileSync(path.join(OUT, "sectional.json"), JSON.stringify(sectional));
fs.writeFileSync(path.join(OUT, "sectional-index.json"), JSON.stringify(sectionalIndex, null, 2));

// ---------- SUMMARY ----------
const totalTopicQ = topicIndex.reduce((a, t) => a + t.count, 0);
const totalUnique = topicIndex.reduce((a, t) => a + t.uniqueQuestions, 0);
const summary = {
  generatedAt: new Date().toISOString(),
  fullMocks: mocks.length,
  fullMockQuestions: mocks.reduce((a, m) => a + m.totalQuestions, 0),
  sectionalTests: sectional.length,
  sectionalQuestions: sectional.reduce((a, s) => a + s.totalQuestions, 0),
  topics: topicIndex.length,
  perTopic: PER_TOPIC,
  topicQuestions: totalTopicQ,
  topicUniqueQuestions: totalUnique,
  grandTotalQuestions:
    mocks.reduce((a, m) => a + m.totalQuestions, 0) +
    sectional.reduce((a, s) => a + s.totalQuestions, 0) +
    totalTopicQ,
};
fs.writeFileSync(path.join(OUT, "summary.json"), JSON.stringify(summary, null, 2));

console.log("Generation complete:");
console.log(JSON.stringify(summary, null, 2));
