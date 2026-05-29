// Deterministic seeded PRNG (mulberry32) so generated banks are reproducible.
export function makeRng(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function rint(rng, min, max) {
  return Math.floor(rng() * (max - min + 1)) + min;
}

export function pick(rng, arr) {
  return arr[Math.floor(rng() * arr.length)];
}

export function shuffle(rng, arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Build a 4-option MCQ. `correct` is the value; `distractors` are wrong values.
// Returns { options: [..4 strings], answerIndex }
export function buildOptions(rng, correct, distractors) {
  const seen = new Set([String(correct)]);
  const opts = [String(correct)];
  for (const d of distractors) {
    const s = String(d);
    if (!seen.has(s) && opts.length < 4) {
      seen.add(s);
      opts.push(s);
    }
  }
  // pad if not enough unique distractors
  let pad = 1;
  while (opts.length < 4) {
    const cand =
      typeof correct === "number"
        ? String(correct + pad * (rng() > 0.5 ? 1 : -1) * (1 + Math.floor(rng() * 5)))
        : String(correct) + "*".repeat(pad);
    if (!seen.has(cand)) {
      seen.add(cand);
      opts.push(cand);
    }
    pad++;
    if (pad > 50) break;
  }
  const order = shuffle(rng, opts.slice(0, 4));
  return { options: order, answerIndex: order.indexOf(String(correct)) };
}
