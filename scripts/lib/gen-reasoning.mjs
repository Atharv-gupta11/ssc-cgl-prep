import { rint, pick, shuffle, buildOptions } from "./rng.mjs";

const ALPHA = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

const REASONING = {
  "Number Series": (rng) => {
    const start = rint(rng, 1, 9);
    const d = rint(rng, 2, 9);
    const series = [start];
    for (let i = 1; i < 5; i++) series.push(series[i - 1] + d);
    const next = series[4] + d;
    const q = `Find the next number in the series: ${series.join(", ")}, ?`;
    const { options, answerIndex } = buildOptions(rng, next, [next + d, next - 1, next + 1]);
    return { question: q, options, answerIndex, explanation: `Each term increases by ${d} (arithmetic progression). Next = ${series[4]} + ${d} = ${next}.`, topic: "Number Series" };
  },

  "Letter Series": (rng) => {
    const start = rint(rng, 0, 10);
    const step = rint(rng, 1, 4);
    const idx = [];
    for (let i = 0; i < 4; i++) idx.push(start + i * step);
    const series = idx.map((i) => ALPHA[i % 26]);
    const nextIdx = (start + 4 * step) % 26;
    const next = ALPHA[nextIdx];
    const q = `Find the next letter: ${series.join(", ")}, ?`;
    const { options, answerIndex } = buildOptions(rng, next, [ALPHA[(nextIdx + 1) % 26], ALPHA[(nextIdx + 2) % 26], ALPHA[(nextIdx + 25) % 26]]);
    return { question: q, options, answerIndex, explanation: `Letters advance by ${step} position(s) each time. After ${series[3]}, skip ${step} → ${next}.`, topic: "Letter Series" };
  },

  "Coding-Decoding": (rng) => {
    const shift = rint(rng, 1, 5);
    const words = ["CAT", "DOG", "SUN", "BOOK", "LAMP", "FISH", "TREE", "RAIN"];
    const word = pick(rng, words);
    const code = word.split("").map((c) => ALPHA[(ALPHA.indexOf(c) + shift) % 26]).join("");
    const q = `In a certain code, each letter is shifted ${shift} place(s) forward. How is "${word}" written in that code?`;
    const wrong1 = word.split("").map((c) => ALPHA[(ALPHA.indexOf(c) + shift + 1) % 26]).join("");
    const wrong2 = word.split("").map((c) => ALPHA[(ALPHA.indexOf(c) - shift + 26) % 26]).join("");
    const wrong3 = word.split("").reverse().join("");
    const { options, answerIndex } = buildOptions(rng, code, [wrong1, wrong2, wrong3]);
    return { question: q, options, answerIndex, explanation: `Shift each letter ${shift} forward: ${word} → ${code}.`, topic: "Coding-Decoding" };
  },

  "Analogy": (rng) => {
    const pairs = [
      ["Dog", "Puppy", "Cat", "Kitten"],
      ["Hand", "Glove", "Foot", "Shoe"],
      ["Bird", "Nest", "Bee", "Hive"],
      ["Author", "Book", "Painter", "Painting"],
      ["Doctor", "Hospital", "Teacher", "School"],
    ];
    const [a, b, c, d] = pick(rng, pairs);
    const q = `${a} : ${b} :: ${c} : ?`;
    const { options, answerIndex } = buildOptions(rng, d, ["Garden", "River", "Mountain"]);
    return { question: q, options, answerIndex, explanation: `${a} relates to ${b} as ${c} relates to ${d}.`, topic: "Analogy" };
  },

  "Odd One Out": (rng) => {
    const groups = [
      { items: ["Rose", "Lily", "Lotus", "Mango"], odd: "Mango", reason: "Mango is a fruit; others are flowers." },
      { items: ["Square", "Circle", "Triangle", "Cube"], odd: "Cube", reason: "Cube is 3-D; others are 2-D shapes." },
      { items: ["Apple", "Banana", "Carrot", "Grapes"], odd: "Carrot", reason: "Carrot is a vegetable; others are fruits." },
      { items: ["Copper", "Iron", "Gold", "Plastic"], odd: "Plastic", reason: "Plastic is not a metal." },
    ];
    const g = pick(rng, groups);
    const order = shuffle(rng, g.items);
    const q = `Find the odd one out: ${order.join(", ")}`;
    const { options, answerIndex } = buildOptions(rng, g.odd, order.filter((x) => x !== g.odd));
    return { question: q, options, answerIndex, explanation: g.reason, topic: "Odd One Out" };
  },

  "Blood Relations": (rng) => {
    const sets = [
      { q: "Pointing to a man, a woman said, 'He is the son of my grandfather's only son.' How is the man related to the woman?", a: "Brother", d: ["Father", "Uncle", "Cousin"], e: "Grandfather's only son = woman's father. His son = woman's brother." },
      { q: "A is the father of B. B is the sister of C. C is the son of A. How is C related to B?", a: "Brother", d: ["Sister", "Father", "Son"], e: "C is the son of A and sibling of B, so C is B's brother." },
    ];
    const s = pick(rng, sets);
    const { options, answerIndex } = buildOptions(rng, s.a, s.d);
    return { question: s.q, options, answerIndex, explanation: s.e, topic: "Blood Relations" };
  },

  "Direction Sense": (rng) => {
    const a = rint(rng, 3, 9), b = rint(rng, 3, 9);
    const dist = +Math.sqrt(a * a + b * b).toFixed(2);
    const q = `A man walks ${a} km North, then turns East and walks ${b} km. How far is he from the starting point?`;
    const { options, answerIndex } = buildOptions(rng, dist, [a + b, +Math.abs(a - b).toFixed(2), +(a * b).toFixed(2)]);
    return { question: q, options, answerIndex, explanation: `Shortest distance = √(${a}² + ${b}²) = √${a * a + b * b} = ${dist} km (Pythagoras).`, topic: "Direction Sense" };
  },

  "Syllogism": (rng) => {
    const s = {
      q: "Statements: All cats are animals. All animals are living. Conclusion: All cats are living. Is the conclusion valid?",
      a: "Yes, it follows",
      d: ["No, it does not follow", "Cannot be determined", "Only partially"],
      e: "Cats ⊆ Animals ⊆ Living, so all cats are living. Conclusion follows.",
    };
    const { options, answerIndex } = buildOptions(rng, s.a, s.d);
    return { question: s.q, options, answerIndex, explanation: s.e, topic: "Syllogism" };
  },

  "Mathematical Operations": (rng) => {
    const a = rint(rng, 4, 12), b = rint(rng, 2, 9), c = rint(rng, 2, 9);
    // If + means ×, × means +, find a + b × c
    const ans = a * b + c;
    const q = `If '+' means '×' and '×' means '+', then find the value of ${a} + ${b} × ${c}.`;
    const { options, answerIndex } = buildOptions(rng, ans, [a + b * c, a * b * c, a + b + c]);
    return { question: q, options, answerIndex, explanation: `Replace symbols: ${a} + ${b} × ${c} becomes ${a} × ${b} + ${c} = ${a * b} + ${c} = ${ans}.`, topic: "Mathematical Operations" };
  },

  "Clock and Calendar": (rng) => {
    const h = rint(rng, 1, 12), m = pick(rng, [0, 15, 30]);
    // angle between hands
    const angle = Math.abs(30 * h - 5.5 * m);
    const ans = +(angle > 180 ? 360 - angle : angle).toFixed(1);
    const q = `Find the angle between the hour and minute hands of a clock at ${h}:${String(m).padStart(2, "0")}.`;
    const { options, answerIndex } = buildOptions(rng, ans, [+(ans + 15).toFixed(1), +(ans + 30).toFixed(1), +(Math.abs(ans - 10)).toFixed(1)]);
    return { question: q, options, answerIndex, explanation: `Angle = |30H − 5.5M| = |30×${h} − 5.5×${m}| = ${angle}°${angle > 180 ? `; reflex adjusted to ${ans}°` : ""}.`, topic: "Clock and Calendar" };
  },
};

export const REASONING_TOPICS = Object.keys(REASONING);
export function genReasoning(topic, rng) {
  return REASONING[topic](rng);
}
