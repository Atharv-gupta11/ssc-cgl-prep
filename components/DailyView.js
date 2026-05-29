"use client";
import { useState } from "react";

export default function DailyView({ kind, title, kicker, description, index, byDate }) {
  const [active, setActive] = useState(index[0]?.date);
  const data = byDate[active] || [];
  const meta = index.find((d) => d.date === active);
  const pdf = meta ? (kind === "news" ? meta.newsPdf : meta.vocabPdf) : null;

  const fmtDate = (d) =>
    new Date(d + "T00:00:00").toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" });

  return (
    <div>
      <div className="hero">
        <div className="kicker">{kicker}</div>
        <h1 className="h1">{title}</h1>
        <p className="sub">{description}</p>
      </div>

      <div className="layout-sidebar" style={{ marginTop: 22 }}>
        <div className="card date-sidebar" style={{ position: "sticky", top: 78 }}>
          <div className="tiny muted" style={{ marginBottom: 10, fontWeight: 700 }}>SELECT DATE</div>
          <div className="list" style={{ maxHeight: 460, overflow: "auto" }}>
            {index.map((d) => (
              <button
                key={d.date}
                className={`btn ${active === d.date ? "" : "ghost"} sm`}
                style={{ justifyContent: "flex-start", width: "100%" }}
                onClick={() => setActive(d.date)}
              >
                {fmtDate(d.date)}
              </button>
            ))}
            {index.length === 0 && <div className="tiny muted">No dates yet. Run the daily update script.</div>}
          </div>
        </div>

        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, flexWrap: "wrap", gap: 10 }}>
            <h2 className="h2" style={{ margin: 0 }}>{active ? fmtDate(active) : "—"}</h2>
            {pdf && (
              <a className="btn sm" href={pdf} target="_blank" rel="noopener noreferrer">⬇ Download PDF</a>
            )}
          </div>

          {kind === "news" ? (
            <div className="list">
              {data.map((n) => (
                <div className="qbox" key={n.id}>
                  <div style={{ marginBottom: 6 }}>
                    <span className="badge">{n.source}</span>{" "}
                    <span className="badge amber">{n.category}</span>
                  </div>
                  <h3 style={{ margin: "4px 0 8px", fontSize: 18 }}>{n.title}</h3>
                  <p className="sub" style={{ marginTop: 0 }}>{n.summary}</p>
                  <div className="expl"><b>Exam point:</b> {n.examPoint}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="list">
              {data.map((w, i) => (
                <div className="qbox" key={w.id}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <h3 style={{ margin: 0, fontSize: 20 }}>{i + 1}. {w.word} <span className="muted" style={{ fontStyle: "italic", fontSize: 14 }}>({w.pos})</span></h3>
                  </div>
                  <p className="sub" style={{ margin: "8px 0 4px" }}><b style={{ color: "var(--text)" }}>Meaning:</b> {w.meaning}</p>
                  <p className="sub" style={{ margin: "4px 0" }}><b style={{ color: "#4ade80" }}>Synonyms:</b> {w.synonyms.join(", ")} &nbsp;·&nbsp; <b style={{ color: "#f87171" }}>Antonyms:</b> {w.antonyms.join(", ")}</p>
                  <div className="expl" style={{ fontStyle: "italic" }}>&ldquo;{w.sentence}&rdquo;</div>
                </div>
              ))}
            </div>
          )}
          {data.length === 0 && <div className="muted" style={{ padding: 20 }}>No content for this date.</div>}
        </div>
      </div>
    </div>
  );
}
