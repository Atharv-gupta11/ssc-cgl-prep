"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";
import { getAttempts, computeAnalytics, clearAttempts } from "@/lib/store";
import { SECTION_LABELS } from "@/lib/labels";

function Bar({ label, value, max = 100, color = "var(--brand)" }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 4 }}>
        <span className="muted">{label}</span><span style={{ fontWeight: 700 }}>{value}%</span>
      </div>
      <div className="progress"><div style={{ width: `${Math.min(100, value)}%`, background: color }} /></div>
    </div>
  );
}

function TrendChart({ trend }) {
  if (!trend || trend.length < 2) return <div className="muted tiny">Take at least 2 tests to see your trend.</div>;
  const W = 520, H = 160, pad = 26;
  const xs = trend.map((_, i) => pad + (i * (W - 2 * pad)) / (trend.length - 1));
  const ys = trend.map((t) => H - pad - (t.accuracy / 100) * (H - 2 * pad));
  const path = xs.map((x, i) => `${i ? "L" : "M"}${x.toFixed(1)},${ys[i].toFixed(1)}`).join(" ");
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto" }}>
      {[0, 25, 50, 75, 100].map((g) => {
        const y = H - pad - (g / 100) * (H - 2 * pad);
        return <g key={g}><line x1={pad} y1={y} x2={W - pad} y2={y} stroke="#25324d" strokeWidth="1" /><text x={4} y={y + 4} fill="#9bacc9" fontSize="10">{g}</text></g>;
      })}
      <path d={path} fill="none" stroke="#60a5fa" strokeWidth="2.5" />
      {xs.map((x, i) => <circle key={i} cx={x} cy={ys[i]} r="4" fill="#3b82f6" />)}
    </svg>
  );
}

export default function Dashboard() {
  const { user, ready } = useAuth();
  const [attempts, setAttempts] = useState([]);
  const [tab, setTab] = useState("overview");

  useEffect(() => {
    if (user) setAttempts(getAttempts(user.email));
  }, [user]);

  const a = useMemo(() => computeAnalytics(attempts), [attempts]);

  if (ready && !user) {
    return (
      <div className="qbox" style={{ maxWidth: 480, margin: "60px auto", textAlign: "center" }}>
        <h1 className="h1">Login required</h1>
        <p className="sub">Please log in to view your performance dashboard.</p>
        <Link href="/login" className="btn" style={{ marginTop: 10 }}>Login / Sign up</Link>
      </div>
    );
  }
  if (!ready) return null;

  if (a.total === 0) {
    return (
      <div className="qbox" style={{ maxWidth: 560, margin: "60px auto", textAlign: "center" }}>
        <div className="kicker">Welcome, {user.name}</div>
        <h1 className="h1">No attempts yet</h1>
        <p className="sub">Take a mock, sectional or topic test and your analytics will appear here.</p>
        <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 12 }}>
          <Link href="/mocks" className="btn">Start a Mock</Link>
          <Link href="/topics" className="btn ghost">Practice Topics</Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="hero">
        <div className="kicker">Performance Analytics</div>
        <h1 className="h1">Hi {user.name.split(" ")[0]}, here&apos;s your progress</h1>
        <div className="grid cols-4" style={{ marginTop: 18 }}>
          <div className="stat"><div className="n">{a.total}</div><div className="l">Tests Taken</div></div>
          <div className="stat"><div className="n">{a.avgAccuracy}%</div><div className="l">Avg Accuracy</div></div>
          <div className="stat"><div className="n">{a.avgScorePct}%</div><div className="l">Avg Score</div></div>
          <div className="stat"><div className="n">{a.totalTimeMin}</div><div className="l">Minutes Practised</div></div>
        </div>
      </div>

      <div className="tabbar" style={{ marginTop: 22 }}>
        {["overview", "sections", "topics", "history"].map((t) => (
          <button key={t} className={tab === t ? "active" : ""} onClick={() => setTab(t)}>{t[0].toUpperCase() + t.slice(1)}</button>
        ))}
      </div>

      {tab === "overview" && (
        <div className="grid cols-2">
          <div className="card">
            <h2 className="h2">Accuracy trend (last {a.trend.length})</h2>
            <TrendChart trend={a.trend} />
          </div>
          <div className="card">
            <h2 className="h2">Answer breakdown</h2>
            <Bar label="Correct" value={a.totalQ ? Math.round((a.totalCorrect / a.totalQ) * 100) : 0} color="#22c55e" />
            <Bar label="Wrong" value={a.totalQ ? Math.round((a.totalWrong / a.totalQ) * 100) : 0} color="#ef4444" />
            <Bar label="Skipped" value={a.totalQ ? Math.round((a.totalSkipped / a.totalQ) * 100) : 0} color="#64748b" />
            <div className="grid cols-3" style={{ marginTop: 14 }}>
              <div className="stat"><div className="n" style={{ color: "#4ade80", fontSize: 22 }}>{a.totalCorrect}</div><div className="l">Correct</div></div>
              <div className="stat"><div className="n" style={{ color: "#f87171", fontSize: 22 }}>{a.totalWrong}</div><div className="l">Wrong</div></div>
              <div className="stat"><div className="n" style={{ color: "var(--muted)", fontSize: 22 }}>{a.totalSkipped}</div><div className="l">Skipped</div></div>
            </div>
          </div>
          <div className="card">
            <h2 className="h2">💪 Strengths</h2>
            {a.strengths.length ? a.strengths.map((s) => <Bar key={s.topic} label={`${s.topic} (${s.total} Q)`} value={s.acc} color="#22c55e" />) : <div className="muted tiny">Attempt more questions per topic to surface strengths.</div>}
          </div>
          <div className="card">
            <h2 className="h2">⚠️ Focus areas (weakest)</h2>
            {a.weaknesses.length ? a.weaknesses.map((s) => (
              <div key={s.topic} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ flex: 1 }}><Bar label={`${s.topic} (${s.total} Q)`} value={s.acc} color="#ef4444" /></div>
              </div>
            )) : <div className="muted tiny">Not enough data yet.</div>}
          </div>
        </div>
      )}

      {tab === "sections" && (
        <div className="card">
          <h2 className="h2">Section-wise accuracy</h2>
          {Object.entries(a.bySection).map(([sec, v]) => (
            <Bar key={sec} label={`${SECTION_LABELS[sec] || sec} — ${v.correct}/${v.total} correct`} value={a.sectionAcc[sec]} />
          ))}
          <p className="tiny muted" style={{ marginTop: 10 }}>Based on all your attempts across mocks, sectional and topic tests.</p>
        </div>
      )}

      {tab === "topics" && (
        <div className="card">
          <h2 className="h2">Topic-wise accuracy</h2>
          <table className="score">
            <thead><tr><th>Topic</th><th>Correct</th><th>Wrong</th><th>Total</th><th>Accuracy</th></tr></thead>
            <tbody>
              {Object.entries(a.byTopic).sort((x, y) => y[1].total - x[1].total).map(([t, v]) => {
                const acc = v.correct + v.wrong ? Math.round((v.correct / (v.correct + v.wrong)) * 100) : 0;
                return <tr key={t}><td>{t}</td><td style={{ color: "#4ade80" }}>{v.correct}</td><td style={{ color: "#f87171" }}>{v.wrong}</td><td>{v.total}</td><td><b style={{ color: acc >= 70 ? "#4ade80" : acc >= 40 ? "#fbbf24" : "#f87171" }}>{acc}%</b></td></tr>;
              })}
            </tbody>
          </table>
        </div>
      )}

      {tab === "history" && (
        <div className="card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h2 className="h2" style={{ margin: 0 }}>Attempt history</h2>
            <button className="btn ghost sm" onClick={() => { if (confirm("Clear all attempt history?")) { clearAttempts(user.email); setAttempts([]); } }}>Clear history</button>
          </div>
          <table className="score" style={{ marginTop: 12 }}>
            <thead><tr><th>Date</th><th>Test</th><th>Type</th><th>Score</th><th>Accuracy</th></tr></thead>
            <tbody>
              {attempts.map((at) => (
                <tr key={at.id}>
                  <td>{new Date(at.at).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</td>
                  <td>{at.title}</td>
                  <td><span className="badge">{at.type}</span></td>
                  <td>{at.score}/{at.max}</td>
                  <td><b style={{ color: at.accuracy >= 70 ? "#4ade80" : at.accuracy >= 40 ? "#fbbf24" : "#f87171" }}>{at.accuracy}%</b></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
