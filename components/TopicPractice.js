"use client";
import { useMemo, useState } from "react";
import QuizEngine from "./QuizEngine";

const KEYS = ["A", "B", "C", "D"];

export default function TopicPractice({ topic, sectionName, questions }) {
  const [mode, setMode] = useState(null); // null | 'test' | 'learn'
  const [setSize, setSetSize] = useState(25);
  const [offset, setOffset] = useState(0);

  const slice = useMemo(() => questions.slice(offset, offset + setSize), [questions, offset, setSize]);

  if (mode === "test") {
    return (
      <div>
        <button className="btn ghost sm" style={{ marginTop: 18 }} onClick={() => setMode(null)}>← Back to {topic}</button>
        <QuizEngine
          config={{
            title: `${topic} — Practice Set (${slice.length} Q)`,
            durationMin: Math.max(5, Math.round(slice.length * 0.75)),
            questions: slice,
            markPerCorrect: 2,
            negativePerWrong: 0.5,
            attemptType: "topic",
          }}
        />
      </div>
    );
  }

  if (mode === "learn") {
    return (
      <div>
        <button className="btn ghost sm" style={{ marginTop: 18 }} onClick={() => setMode(null)}>← Back</button>
        <h1 className="h1" style={{ marginTop: 12 }}>{topic} — Learn Mode</h1>
        <p className="sub">Browse questions with answers &amp; explanations revealed. Set {offset + 1}–{offset + slice.length} of {questions.length}.</p>
        <div className="list" style={{ marginTop: 16 }}>
          {slice.map((item, i) => (
            <div className="qbox" key={item.id}>
              <div className="tiny muted" style={{ marginBottom: 6 }}>Q{offset + i + 1} · <span className={`badge ${item.difficulty === "Hard" ? "red" : item.difficulty === "Easy" ? "green" : "amber"}`}>{item.difficulty}</span></div>
              <div style={{ fontWeight: 600, marginBottom: 10 }}>{item.question}</div>
              {item.options.map((o, oi) => (
                <div className={`opt ${oi === item.answerIndex ? "correct" : ""}`} key={oi}>
                  <span className="key">{KEYS[oi]}</span><span>{o}</span>
                </div>
              ))}
              <div className="expl"><b>Answer:</b> {KEYS[item.answerIndex]}. <b>Explanation:</b> {item.explanation}</div>
            </div>
          ))}
        </div>
        <Pager questions={questions} offset={offset} setSize={setSize} setOffset={setOffset} />
      </div>
    );
  }

  return (
    <div>
      <div className="hero">
        <div className="kicker">{sectionName}</div>
        <h1 className="h1">{topic}</h1>
        <p className="sub">{questions.length} practice questions with detailed solutions. Choose a set size and start a timed test, or study in Learn mode.</p>
        <div style={{ display: "flex", gap: 14, marginTop: 16, flexWrap: "wrap", alignItems: "center" }}>
          <label className="tiny muted">Set size:&nbsp;
            <select className="select" value={setSize} onChange={(e) => { setSetSize(Number(e.target.value)); setOffset(0); }}>
              {[10, 25, 50].map((n) => <option key={n} value={n}>{n} questions</option>)}
            </select>
          </label>
          <label className="tiny muted">Start from:&nbsp;
            <select className="select" value={offset} onChange={(e) => setOffset(Number(e.target.value))}>
              {Array.from({ length: Math.ceil(questions.length / setSize) }, (_, i) => i * setSize).map((o) => (
                <option key={o} value={o}>Q{o + 1}–{Math.min(o + setSize, questions.length)}</option>
              ))}
            </select>
          </label>
        </div>
        <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
          <button className="btn" onClick={() => setMode("test")}>Start Timed Test</button>
          <button className="btn ghost" onClick={() => setMode("learn")}>Learn Mode</button>
        </div>
      </div>
    </div>
  );
}

function Pager({ questions, offset, setSize, setOffset }) {
  const pages = Math.ceil(questions.length / setSize);
  const cur = Math.floor(offset / setSize);
  return (
    <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 18, flexWrap: "wrap" }}>
      <button className="btn ghost sm" disabled={cur === 0} onClick={() => setOffset(Math.max(0, offset - setSize))}>← Prev</button>
      <span className="badge" style={{ alignSelf: "center" }}>Page {cur + 1} / {pages}</span>
      <button className="btn ghost sm" disabled={cur >= pages - 1} onClick={() => setOffset(offset + setSize)}>Next →</button>
    </div>
  );
}
