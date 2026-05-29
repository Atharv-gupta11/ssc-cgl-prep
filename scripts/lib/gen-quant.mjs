import { rint, pick, buildOptions } from "./rng.mjs";

// Quantitative Aptitude generators. Each returns {question, options, answerIndex, explanation, topic, difficulty}
const gcd = (a, b) => (b ? gcd(b, a % b) : a);

const QUANT = {
  "Percentage": (rng) => {
    const base = rint(rng, 200, 2000);
    const p = pick(rng, [5, 10, 12.5, 15, 20, 25, 30, 40, 50, 60, 75]);
    const ans = +((base * p) / 100).toFixed(2);
    const q = `What is ${p}% of ${base}?`;
    const { options, answerIndex } = buildOptions(rng, ans, [
      +((base * p) / 100 + base * 0.01).toFixed(2),
      +((base * (p + 5)) / 100).toFixed(2),
      +((base * p) / 1000).toFixed(2),
    ]);
    return { question: q, options, answerIndex, explanation: `${p}% of ${base} = (${p}/100) × ${base} = ${ans}.`, topic: "Percentage" };
  },

  "Profit and Loss": (rng) => {
    const cp = rint(rng, 100, 2000);
    const profit = pick(rng, [5, 10, 12, 15, 20, 25, 30]);
    const sp = +(cp * (1 + profit / 100)).toFixed(2);
    const q = `An article is bought for ₹${cp} and sold at a profit of ${profit}%. Find the selling price.`;
    const { options, answerIndex } = buildOptions(rng, sp, [
      +(cp * (1 - profit / 100)).toFixed(2),
      +(cp + profit).toFixed(2),
      +(cp * (1 + (profit + 5) / 100)).toFixed(2),
    ]);
    return { question: q, options, answerIndex, explanation: `SP = CP × (1 + Profit%/100) = ${cp} × (1 + ${profit}/100) = ₹${sp}.`, topic: "Profit and Loss" };
  },

  "Simple Interest": (rng) => {
    const p = rint(rng, 1, 20) * 1000;
    const r = pick(rng, [4, 5, 6, 8, 10, 12]);
    const t = rint(rng, 2, 6);
    const si = (p * r * t) / 100;
    const q = `Find the simple interest on ₹${p} at ${r}% per annum for ${t} years.`;
    const { options, answerIndex } = buildOptions(rng, si, [
      (p * r * (t + 1)) / 100,
      (p * (r + 2) * t) / 100,
      p + si,
    ]);
    return { question: q, options, answerIndex, explanation: `SI = (P × R × T)/100 = (${p} × ${r} × ${t})/100 = ₹${si}.`, topic: "Simple Interest" };
  },

  "Compound Interest": (rng) => {
    const p = rint(rng, 1, 10) * 1000;
    const r = pick(rng, [5, 10, 20]);
    const t = rint(rng, 2, 3);
    const amount = +(p * Math.pow(1 + r / 100, t)).toFixed(2);
    const ci = +(amount - p).toFixed(2);
    const q = `Find the compound interest on ₹${p} at ${r}% per annum for ${t} years (compounded annually).`;
    const { options, answerIndex } = buildOptions(rng, ci, [
      (p * r * t) / 100,
      +(amount).toFixed(2),
      +(ci + p * 0.05).toFixed(2),
    ]);
    return { question: q, options, answerIndex, explanation: `A = P(1+R/100)^T = ${p}(1+${r}/100)^${t} = ₹${amount}. CI = A − P = ₹${ci}.`, topic: "Compound Interest" };
  },

  "Average": (rng) => {
    const n = rint(rng, 4, 7);
    const nums = Array.from({ length: n }, () => rint(rng, 10, 99));
    const sum = nums.reduce((a, b) => a + b, 0);
    const avg = +(sum / n).toFixed(2);
    const q = `Find the average of the numbers: ${nums.join(", ")}.`;
    const { options, answerIndex } = buildOptions(rng, avg, [
      +(sum / (n + 1)).toFixed(2),
      +(avg + 2).toFixed(2),
      +(avg - 3).toFixed(2),
    ]);
    return { question: q, options, answerIndex, explanation: `Average = Sum/Count = ${sum}/${n} = ${avg}.`, topic: "Average" };
  },

  "Ratio and Proportion": (rng) => {
    const a = rint(rng, 2, 9), b = rint(rng, 2, 9);
    const mult = rint(rng, 3, 12);
    const total = (a + b) * mult;
    const partA = a * mult;
    const q = `Two numbers are in the ratio ${a}:${b}. If their sum is ${total}, find the larger... actually find the first number.`;
    const cleanQ = `Two numbers are in the ratio ${a}:${b}. If their sum is ${total}, find the first number.`;
    const { options, answerIndex } = buildOptions(rng, partA, [b * mult, partA + mult, total - partA + 1]);
    return { question: cleanQ, options, answerIndex, explanation: `Sum of ratio terms = ${a}+${b} = ${a + b}. One part = ${total}/${a + b} = ${mult}. First number = ${a} × ${mult} = ${partA}.`, topic: "Ratio and Proportion" };
  },

  "Time and Work": (rng) => {
    const x = rint(rng, 5, 20), y = rint(rng, 5, 20);
    const together = +((x * y) / (x + y)).toFixed(2);
    const q = `A can do a work in ${x} days and B in ${y} days. Working together, in how many days will they finish it?`;
    const { options, answerIndex } = buildOptions(rng, together, [+((x + y) / 2).toFixed(2), x + y, +((x * y) / (x - y || 1)).toFixed(2)]);
    return { question: q, options, answerIndex, explanation: `Together's 1-day work = 1/${x} + 1/${y} = (${x}+${y})/(${x}×${y}). Time = ${x}×${y}/(${x}+${y}) = ${together} days.`, topic: "Time and Work" };
  },

  "Speed Time Distance": (rng) => {
    const speed = rint(rng, 30, 90);
    const time = rint(rng, 2, 8);
    const dist = speed * time;
    const q = `A car travels at ${speed} km/h for ${time} hours. What distance does it cover?`;
    const { options, answerIndex } = buildOptions(rng, dist, [speed * (time + 1), speed + time, dist + 10]);
    return { question: q, options, answerIndex, explanation: `Distance = Speed × Time = ${speed} × ${time} = ${dist} km.`, topic: "Speed Time Distance" };
  },

  "Number System": (rng) => {
    const a = rint(rng, 12, 60), b = rint(rng, 12, 60);
    const g = gcd(a, b);
    const l = (a * b) / g;
    const q = `Find the LCM of ${a} and ${b}.`;
    const { options, answerIndex } = buildOptions(rng, l, [g, a * b, l + a]);
    return { question: q, options, answerIndex, explanation: `HCF(${a},${b}) = ${g}. LCM = (${a}×${b})/HCF = ${a * b}/${g} = ${l}.`, topic: "Number System" };
  },

  "Mensuration": (rng) => {
    const r = rint(rng, 7, 21);
    const area = +((22 / 7) * r * r).toFixed(2);
    const q = `Find the area of a circle of radius ${r} cm (use π = 22/7).`;
    const { options, answerIndex } = buildOptions(rng, area, [+((22 / 7) * 2 * r).toFixed(2), +((22 / 7) * r).toFixed(2), area + r]);
    return { question: q, options, answerIndex, explanation: `Area = πr² = (22/7) × ${r}² = (22/7) × ${r * r} = ${area} cm².`, topic: "Mensuration" };
  },

  "Algebra": (rng) => {
    const x = rint(rng, 2, 12);
    const a = rint(rng, 2, 9), b = rint(rng, 1, 20);
    const c = a * x + b;
    const q = `If ${a}x + ${b} = ${c}, find the value of x.`;
    const { options, answerIndex } = buildOptions(rng, x, [x + 1, x - 1, c - b]);
    return { question: q, options, answerIndex, explanation: `${a}x = ${c} − ${b} = ${c - b}. x = ${c - b}/${a} = ${x}.`, topic: "Algebra" };
  },

  "Simplification": (rng) => {
    const a = rint(rng, 5, 20), b = rint(rng, 2, 9), c = rint(rng, 2, 9);
    const ans = a + b * c;
    const q = `Simplify using BODMAS: ${a} + ${b} × ${c}`;
    const { options, answerIndex } = buildOptions(rng, ans, [(a + b) * c, a + b + c, a * b + c]);
    return { question: q, options, answerIndex, explanation: `By BODMAS, multiply first: ${b} × ${c} = ${b * c}. Then ${a} + ${b * c} = ${ans}.`, topic: "Simplification" };
  },
};

export const QUANT_TOPICS = Object.keys(QUANT);
export function genQuant(topic, rng) {
  return QUANT[topic](rng);
}
