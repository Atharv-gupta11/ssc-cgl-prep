import fs from "fs";
import path from "path";

const DATA = path.join(process.cwd(), "data");

function read(file) {
  return JSON.parse(fs.readFileSync(path.join(DATA, file), "utf-8"));
}

export const getSummary = () => read("summary.json");
export const getMockIndex = () => read("mock-index.json");
export const getSectionalIndex = () => read("sectional-index.json");
export const getTopicIndex = () => read("topic-index.json");
export const getDailyIndex = () => {
  try {
    return read("daily-index.json");
  } catch {
    return [];
  }
};

export function getMock(id) {
  const mocks = read("mocks.json");
  return mocks.find((m) => m.id === id) || null;
}

export function getSectional(id) {
  const tests = read("sectional.json");
  return tests.find((t) => t.id === id) || null;
}

export function getTopicQuestions(slug) {
  const banks = read("topic-banks.json");
  const index = getTopicIndex();
  const entry = index.find((t) => t.slug === slug);
  if (!entry) return null;
  return { entry, questions: banks[entry.section][entry.topic] };
}

export function getDaily(date) {
  try {
    return read(path.join("daily", `${date}.json`));
  } catch {
    return null;
  }
}

export { SECTION_LABELS } from "./labels";
