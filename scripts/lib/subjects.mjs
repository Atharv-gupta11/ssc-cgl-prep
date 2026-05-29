import { QUANT_TOPICS, genQuant } from "./gen-quant.mjs";
import { REASONING_TOPICS, genReasoning } from "./gen-reasoning.mjs";
import { ENGLISH_TOPICS, genEnglish } from "./gen-english.mjs";
import { GA_TOPICS, genGA } from "./gen-ga.mjs";

// Tier-1 sections (latest SSC CGL 2025 pattern): 4 sections, 25 Q each, 50 marks each, 60 min total.
export const SECTIONS = [
  {
    id: "reasoning",
    name: "General Intelligence & Reasoning",
    short: "Reasoning",
    topics: REASONING_TOPICS,
    gen: genReasoning,
    perSection: 25,
  },
  {
    id: "ga",
    name: "General Awareness",
    short: "GA",
    topics: GA_TOPICS,
    gen: genGA,
    perSection: 25,
  },
  {
    id: "quant",
    name: "Quantitative Aptitude",
    short: "Quant",
    topics: QUANT_TOPICS,
    gen: genQuant,
    perSection: 25,
  },
  {
    id: "english",
    name: "English Comprehension",
    short: "English",
    topics: ENGLISH_TOPICS,
    gen: genEnglish,
    perSection: 25,
  },
];

export function sectionById(id) {
  return SECTIONS.find((s) => s.id === id);
}
