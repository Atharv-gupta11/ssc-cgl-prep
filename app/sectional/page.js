import Link from "next/link";
import { getSectionalIndex, SECTION_LABELS } from "@/lib/data";

export default function SectionalPage() {
  const tests = getSectionalIndex();
  const grouped = tests.reduce((acc, t) => {
    (acc[t.section] = acc[t.section] || []).push(t);
    return acc;
  }, {});

  return (
    <div>
      <div className="hero">
        <div className="kicker">Section-wise • 25 Questions • 15 Minutes each</div>
        <h1 className="h1">Sectional Tests</h1>
        <p className="sub">
          {tests.length} timed sectional tests with strict sectional timing to sharpen speed and accuracy in each
          subject before attempting full mocks.
        </p>
      </div>
      {Object.entries(grouped).map(([sec, list]) => (
        <div key={sec} style={{ marginTop: 26 }}>
          <h2 className="h2">{SECTION_LABELS[sec]} <span className="badge">{list.length} tests</span></h2>
          <div className="grid cols-4">
            {list.map((t) => (
              <Link key={t.id} href={`/sectional/${t.id}`} className="card hover">
                <h3 style={{ margin: 0, fontSize: 16 }}>{t.title}</h3>
                <div className="tiny muted" style={{ marginTop: 6 }}>{t.totalQuestions} Q · {t.durationMin} min</div>
                <div className="btn sm" style={{ marginTop: 10, width: "100%" }}>Start</div>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
