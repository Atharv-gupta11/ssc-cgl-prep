import Link from "next/link";
import { getSummary, getDailyIndex, getMockIndex } from "@/lib/data";

export default function Home() {
  const s = getSummary();
  const daily = getDailyIndex();
  const latest = daily[0];
  const mocks = getMockIndex();

  const features = [
    { href: "/mocks", title: "Full-Length Mocks", desc: `${s.fullMocks} complete Tier-1 mocks (100 Q each) with sectional timing & all-India pattern.`, n: s.fullMocks, l: "Mocks" },
    { href: "/sectional", title: "Sectional Tests", desc: `${s.sectionalTests} timed sectional tests across all 4 sections to build speed & accuracy.`, n: s.sectionalTests, l: "Tests" },
    { href: "/topics", title: "Topic-wise Practice", desc: `${s.topics} topics with ${s.perTopic} questions each — master concepts that recur in CGL.`, n: s.topics, l: "Topics" },
    { href: "/current-affairs", title: "Daily Current Affairs", desc: "PIB & government-source digest, updated daily with date-wise PDF downloads.", n: daily.length, l: "Days" },
    { href: "/vocabulary", title: "Daily Vocabulary", desc: "Most-probable CGL words with synonyms, antonyms & usage — daily, with PDFs.", n: 10, l: "Words/day" },
    { href: "/exam-info", title: "Exam Pattern & Syllabus", desc: "Latest SSC CGL 2025 notification pattern, marking scheme & complete syllabus.", n: "T1", l: "+ T2" },
  ];

  return (
    <div>
      <section className="hero">
        <div className="kicker">SSC CGL 2025 • Tier-1 &amp; Tier-2 Aligned</div>
        <h1 className="h1" style={{ fontSize: 40, marginTop: 8 }}>Crack SSC CGL with a complete, practice-first platform.</h1>
        <p className="sub" style={{ maxWidth: 720, fontSize: 17 }}>
          Full-length mocks, sectional tests, topic-wise question banks, and daily current affairs &amp; vocabulary —
          all built to the latest SSC CGL exam pattern with detailed solutions for every question.
        </p>
        <div style={{ display: "flex", gap: 12, marginTop: 18, flexWrap: "wrap" }}>
          <Link href="/mocks" className="btn">Start a Full Mock</Link>
          <Link href="/topics" className="btn ghost">Practice by Topic</Link>
          {latest && <Link href="/current-affairs" className="btn ghost">Today&apos;s Current Affairs</Link>}
        </div>
        <div className="grid cols-4" style={{ marginTop: 26 }}>
          <div className="stat"><div className="n">{s.grandTotalQuestions.toLocaleString()}</div><div className="l">Total Questions</div></div>
          <div className="stat"><div className="n">{s.fullMocks}</div><div className="l">Full Mocks</div></div>
          <div className="stat"><div className="n">{s.sectionalTests}</div><div className="l">Sectional Tests</div></div>
          <div className="stat"><div className="n">{s.topics}</div><div className="l">Topics</div></div>
        </div>
      </section>

      <h2 className="h2" style={{ marginTop: 34 }}>Everything you need</h2>
      <div className="grid cols-3">
        {features.map((f) => (
          <Link key={f.href} href={f.href} className="card hover">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <h3 style={{ margin: 0, fontSize: 18 }}>{f.title}</h3>
              <div className="stat"><div className="n" style={{ fontSize: 22 }}>{f.n}</div><div className="l">{f.l}</div></div>
            </div>
            <p className="sub" style={{ marginTop: 8 }}>{f.desc}</p>
            <div className="badge" style={{ marginTop: 4 }}>Open →</div>
          </Link>
        ))}
      </div>

      <div className="card" style={{ marginTop: 24 }}>
        <h2 className="h2">Quick start: jump into a mock</h2>
        <div className="grid cols-3">
          {mocks.slice(0, 6).map((m) => (
            <Link key={m.id} href={`/mocks/${m.id}`} className="row">
              <div>
                <div style={{ fontWeight: 700 }}>{m.title}</div>
                <div className="tiny muted">{m.totalQuestions} Q · {m.durationMin} min · {m.totalMarks} marks</div>
              </div>
              <span className="badge">Take →</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
