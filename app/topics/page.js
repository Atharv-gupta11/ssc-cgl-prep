import Link from "next/link";
import { getTopicIndex, SECTION_LABELS } from "@/lib/data";

export default function TopicsPage() {
  const topics = getTopicIndex();
  const grouped = topics.reduce((acc, t) => {
    (acc[t.section] = acc[t.section] || []).push(t);
    return acc;
  }, {});

  return (
    <div>
      <div className="hero">
        <div className="kicker">Concept Mastery • 200 Questions per Topic</div>
        <h1 className="h1">Topic-wise Practice</h1>
        <p className="sub">
          {topics.length} topics across all four sections, each with a {topics[0]?.count}-question bank and full
          solutions. Practice in sets of 10/25/50 to build concepts that frequently appear in SSC CGL.
        </p>
      </div>
      {Object.entries(grouped).map(([sec, list]) => (
        <div key={sec} style={{ marginTop: 26 }}>
          <h2 className="h2">{SECTION_LABELS[sec]} <span className="badge">{list.length} topics</span></h2>
          <div className="grid cols-3">
            {list.map((t) => (
              <Link key={t.slug} href={`/topics/${t.slug}`} className="card hover">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <h3 style={{ margin: 0, fontSize: 16 }}>{t.topic}</h3>
                  <span className="badge">{t.count} Q</span>
                </div>
                <div className="btn sm" style={{ marginTop: 12, width: "100%" }}>Practice</div>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
