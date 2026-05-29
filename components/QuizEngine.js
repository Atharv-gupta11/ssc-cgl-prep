"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "./AuthProvider";
import { saveAttempt } from "@/lib/store";

function fmtTime(s) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

const KEYS = ["A", "B", "C", "D"];

/**
 * config = {
 *   title, durationMin, questions: [{id, question, options[], answerIndex, explanation, section, topic, difficulty}],
 *   markPerCorrect, negativePerWrong,
 *   sectionTiming?: [{section, name, minutes, questions}]  // optional, for full mocks
 *   sectionLabels?: {id:name}
 * }
 */
export default function QuizEngine({ config }) {
  const { questions, durationMin, markPerCorrect = 2, negativePerWrong = 0.5 } = config;
  const { user } = useAuth();
  const startRef = useRef(null);
  const savedRef = useRef(false);
  const [started, setStarted] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [cur, setCur] = useState(0);
  const [answers, setAnswers] = useState({}); // id -> optionIndex
  const [marked, setMarked] = useState({}); // id -> bool
  const [remaining, setRemaining] = useState(durationMin * 60);
  const [reviewFilter, setReviewFilter] = useState("all");
  const tick = useRef(null);

  useEffect(() => {
    if (started && !startRef.current) startRef.current = Date.now();
  }, [started]);

  useEffect(() => {
    if (started && !submitted) {
      tick.current = setInterval(() => {
        setRemaining((r) => {
          if (r <= 1) {
            clearInterval(tick.current);
            setSubmitted(true);
            return 0;
          }
          return r - 1;
        });
      }, 1000);
      return () => clearInterval(tick.current);
    }
  }, [started, submitted]);

  const q = questions[cur];

  const score = useMemo(() => {
    let correct = 0, wrong = 0, skipped = 0;
    const perSection = {};
    const perTopic = {};
    for (const item of questions) {
      const sec = item.section || "all";
      perSection[sec] = perSection[sec] || { correct: 0, wrong: 0, skipped: 0, total: 0 };
      perSection[sec].total++;
      const tp = item.topic || "General";
      perTopic[tp] = perTopic[tp] || { correct: 0, wrong: 0, total: 0 };
      perTopic[tp].total++;
      const a = answers[item.id];
      if (a === undefined) { skipped++; perSection[sec].skipped++; }
      else if (a === item.answerIndex) { correct++; perSection[sec].correct++; perTopic[tp].correct++; }
      else { wrong++; perSection[sec].wrong++; perTopic[tp].wrong++; }
    }
    const marks = +(correct * markPerCorrect - wrong * negativePerWrong).toFixed(2);
    const max = questions.length * markPerCorrect;
    return { correct, wrong, skipped, marks, max, perSection, perTopic, accuracy: correct + wrong ? Math.round((correct / (correct + wrong)) * 100) : 0 };
  }, [answers, questions, markPerCorrect, negativePerWrong]);

  useEffect(() => {
    if (submitted && !savedRef.current && user) {
      savedRef.current = true;
      const timeSpentSec = startRef.current ? Math.round((Date.now() - startRef.current) / 1000) : 0;
      saveAttempt(user.email, {
        title: config.title,
        type: config.attemptType || "test",
        totalQuestions: questions.length,
        correct: score.correct,
        wrong: score.wrong,
        skipped: score.skipped,
        score: score.marks,
        max: score.max,
        accuracy: score.accuracy,
        perSection: score.perSection,
        perTopic: score.perTopic,
        timeSpentSec,
      });
    }
  }, [submitted, user, score, config, questions.length]);

  if (!started) {
    return (
      <div className="qbox" style={{ maxWidth: 620, margin: "30px auto", textAlign: "center" }}>
        <div className="kicker">Instructions</div>
        <h1 className="h1" style={{ marginTop: 6 }}>{config.title}</h1>
        <div className="grid cols-3" style={{ margin: "18px 0" }}>
          <div className="stat"><div className="n">{questions.length}</div><div className="l">Questions</div></div>
          <div className="stat"><div className="n">{durationMin}</div><div className="l">Minutes</div></div>
          <div className="stat"><div className="n">{questions.length * markPerCorrect}</div><div className="l">Max Marks</div></div>
        </div>
        <ul style={{ textAlign: "left", color: "var(--muted)", fontSize: 14, lineHeight: 1.9 }}>
          <li>+{markPerCorrect} for each correct answer, −{negativePerWrong} for each wrong answer.</li>
          <li>Unanswered questions carry no penalty.</li>
          {config.sectionTiming && <li>Suggested sectional timing is shown; the overall timer governs submission.</li>}
          <li>Use the question palette to jump, and "Mark for Review" to flag.</li>
          <li>The test auto-submits when the timer hits zero.</li>
        </ul>
        <button className="btn" style={{ marginTop: 18, width: "100%" }} onClick={() => setStarted(true)}>Start Test</button>
      </div>
    );
  }

  if (submitted) {
    const filtered = questions.filter((item) => {
      const a = answers[item.id];
      if (reviewFilter === "correct") return a === item.answerIndex;
      if (reviewFilter === "wrong") return a !== undefined && a !== item.answerIndex;
      if (reviewFilter === "skipped") return a === undefined;
      return true;
    });
    return (
      <div>
        <div className="card" style={{ marginTop: 24 }}>
          <div className="kicker">Result</div>
          <h1 className="h1">{config.title}</h1>
          <div className="grid cols-4" style={{ marginTop: 10 }}>
            <div className="stat"><div className="n">{score.marks}</div><div className="l">Score / {score.max}</div></div>
            <div className="stat"><div className="n" style={{ color: "#4ade80" }}>{score.correct}</div><div className="l">Correct</div></div>
            <div className="stat"><div className="n" style={{ color: "#f87171" }}>{score.wrong}</div><div className="l">Wrong</div></div>
            <div className="stat"><div className="n" style={{ color: "var(--muted)" }}>{score.skipped}</div><div className="l">Skipped</div></div>
          </div>
          <div style={{ marginTop: 14 }}>
            <div className="sub" style={{ marginBottom: 6 }}>Accuracy: <b style={{ color: "var(--brand2)" }}>{score.accuracy}%</b></div>
            <div className="progress"><div style={{ width: `${score.accuracy}%` }} /></div>
          </div>
          {user ? (
            <div className="badge green" style={{ marginTop: 14, padding: "8px 12px" }}>✓ Saved to your dashboard analytics</div>
          ) : (
            <div className="badge amber" style={{ marginTop: 14, padding: "8px 12px" }}>
              Not logged in — <a href="/login" style={{ textDecoration: "underline" }}>login</a> to save this attempt &amp; track progress.
            </div>
          )}
          {Object.keys(score.perSection).length > 1 && (
            <table className="score" style={{ marginTop: 18 }}>
              <thead><tr><th>Section</th><th>Correct</th><th>Wrong</th><th>Skipped</th><th>Total</th></tr></thead>
              <tbody>
                {Object.entries(score.perSection).map(([sec, v]) => (
                  <tr key={sec}>
                    <td>{(config.sectionLabels && config.sectionLabels[sec]) || sec}</td>
                    <td style={{ color: "#4ade80" }}>{v.correct}</td>
                    <td style={{ color: "#f87171" }}>{v.wrong}</td>
                    <td>{v.skipped}</td>
                    <td>{v.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="tabbar" style={{ marginTop: 24 }}>
          {["all", "wrong", "skipped", "correct"].map((f) => (
            <button key={f} className={reviewFilter === f ? "active" : ""} onClick={() => setReviewFilter(f)}>
              {f[0].toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        <div className="list">
          {filtered.map((item, i) => {
            const a = answers[item.id];
            return (
              <div className="qbox" key={item.id}>
                <div className="tiny muted" style={{ marginBottom: 6 }}>
                  {item.topic && <span className="badge" style={{ marginRight: 8 }}>{item.topic}</span>}
                  {item.difficulty && <span className={`badge ${item.difficulty === "Hard" ? "red" : item.difficulty === "Easy" ? "green" : "amber"}`}>{item.difficulty}</span>}
                </div>
                <div style={{ fontWeight: 600, marginBottom: 10 }}>{item.question}</div>
                {item.options.map((o, oi) => {
                  let cls = "opt";
                  if (oi === item.answerIndex) cls += " correct";
                  else if (oi === a) cls += " wrong";
                  return (
                    <div className={cls} key={oi}>
                      <span className="key">{KEYS[oi]}</span><span>{o}</span>
                    </div>
                  );
                })}
                <div className="expl"><b>Explanation:</b> {item.explanation}</div>
              </div>
            );
          })}
          {filtered.length === 0 && <div className="muted" style={{ padding: 20 }}>No questions in this category.</div>}
        </div>
      </div>
    );
  }

  // Active test view
  const answeredCount = Object.keys(answers).length;
  const timerCls = remaining < 60 ? "timer danger" : remaining < 300 ? "timer warn" : "timer";

  return (
    <div className="layout-sidebar-reverse" style={{ marginTop: 22 }}>
      <div className="qbox">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <div className="tiny muted">Question {cur + 1} of {questions.length}</div>
          <div className="tiny">
            {q.topic && <span className="badge" style={{ marginRight: 6 }}>{q.topic}</span>}
            {q.difficulty && <span className={`badge ${q.difficulty === "Hard" ? "red" : q.difficulty === "Easy" ? "green" : "amber"}`}>{q.difficulty}</span>}
          </div>
        </div>
        <div style={{ fontSize: 17, fontWeight: 600, marginBottom: 16 }}>{q.question}</div>
        {q.options.map((o, oi) => (
          <button
            key={oi}
            className={`opt ${answers[q.id] === oi ? "selected" : ""}`}
            onClick={() => setAnswers((a) => ({ ...a, [q.id]: oi }))}
          >
            <span className="key">{KEYS[oi]}</span><span>{o}</span>
          </button>
        ))}
        <div style={{ display: "flex", gap: 8, marginTop: 14, flexWrap: "wrap" }}>
          <button className="btn ghost sm" disabled={cur === 0} onClick={() => setCur((c) => Math.max(0, c - 1))}>← Prev</button>
          <button className="btn ghost sm" onClick={() => setMarked((m) => ({ ...m, [q.id]: !m[q.id] }))}>
            {marked[q.id] ? "Unmark" : "Mark for Review"}
          </button>
          <button className="btn ghost sm" onClick={() => setAnswers((a) => { const n = { ...a }; delete n[q.id]; return n; })}>Clear</button>
          <button className="btn sm" disabled={cur === questions.length - 1} onClick={() => setCur((c) => Math.min(questions.length - 1, c + 1))} style={{ marginLeft: "auto" }}>Next →</button>
        </div>
      </div>

      <div className="card" style={{ position: "sticky", top: 78 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <span className="tiny muted">Time left</span>
          <span className={timerCls}>{fmtTime(remaining)}</span>
        </div>
        <div className="tiny muted" style={{ marginBottom: 8 }}>Answered {answeredCount}/{questions.length}</div>
        <div className="progress" style={{ marginBottom: 14 }}><div style={{ width: `${(answeredCount / questions.length) * 100}%` }} /></div>
        <div className="palette">
          {questions.map((item, i) => {
            let cls = "pcell";
            if (answers[item.id] !== undefined) cls += " answered";
            if (marked[item.id]) cls += " marked";
            if (i === cur) cls += " current";
            return <button key={item.id} className={cls} onClick={() => setCur(i)}>{i + 1}</button>;
          })}
        </div>
        <button className="btn" style={{ width: "100%", marginTop: 16 }} onClick={() => { if (confirm("Submit the test now?")) setSubmitted(true); }}>Submit Test</button>
      </div>
    </div>
  );
}
