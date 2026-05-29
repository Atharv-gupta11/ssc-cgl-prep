import Link from "next/link";
import { getMockIndex } from "@/lib/data";

export default function MocksPage() {
  const mocks = getMockIndex();
  return (
    <div>
      <div className="hero">
        <div className="kicker">Tier-1 • 100 Questions • 60 Minutes</div>
        <h1 className="h1">Full-Length Mock Tests</h1>
        <p className="sub">
          {mocks.length} complete mocks following the latest SSC CGL Tier-1 pattern: 25 questions each in Reasoning,
          General Awareness, Quantitative Aptitude and English. +2 per correct, −0.5 per wrong. Includes a suggested
          15-minute-per-section timing guide.
        </p>
      </div>
      <div className="grid cols-3" style={{ marginTop: 22 }}>
        {mocks.map((m, i) => (
          <Link key={m.id} href={`/mocks/${m.id}`} className="card hover">
            <div className="badge">Mock {i + 1}</div>
            <h3 style={{ margin: "10px 0 6px", fontSize: 18 }}>{m.title}</h3>
            <div className="tiny muted">{m.totalQuestions} questions · {m.totalMarks} marks</div>
            <div className="tiny muted">{m.durationMin} minutes · 4 sections</div>
            <div className="btn sm" style={{ marginTop: 12, width: "100%" }}>Start Mock</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
