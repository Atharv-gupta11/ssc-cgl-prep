export const metadata = { title: "SSC CGL 2025 Exam Pattern & Syllabus" };

const tier1 = [
  ["General Intelligence & Reasoning", 25, 50],
  ["General Awareness", 25, 50],
  ["Quantitative Aptitude", 25, 50],
  ["English Comprehension", 25, 50],
];

const tier2p1 = [
  ["Section I · Module I", "Mathematical Abilities", 30, 90],
  ["Section I · Module II", "Reasoning & General Intelligence", 30, 90],
  ["Section II · Module I", "English Language & Comprehension", 45, 135],
  ["Section II · Module II", "General Awareness", 25, 75],
  ["Section III · Module I", "Computer Knowledge Test (qualifying)", 20, 60],
  ["Section III · Module II", "Data Entry Speed Test (qualifying)", "1 task", "—"],
];

const syllabus = {
  "Quantitative Aptitude": ["Number Systems", "Percentage", "Profit & Loss", "Simple & Compound Interest", "Ratio & Proportion", "Average", "Time & Work", "Speed, Time & Distance", "Mensuration", "Algebra", "Geometry", "Trigonometry", "Data Interpretation", "Simplification"],
  "General Intelligence & Reasoning": ["Analogies", "Classification (Odd one out)", "Series (Number & Letter)", "Coding-Decoding", "Blood Relations", "Direction Sense", "Syllogism", "Mathematical Operations", "Clock & Calendar", "Non-verbal Reasoning"],
  "English Comprehension": ["Synonyms & Antonyms", "Idioms & Phrases", "One Word Substitution", "Spelling Correction", "Fill in the Blanks", "Sentence Improvement", "Active/Passive Voice", "Error Detection", "Reading Comprehension", "Cloze Test"],
  "General Awareness": ["Indian Polity", "History", "Geography", "Economy", "General Science", "Static GK", "Current Affairs"],
};

export default function ExamInfo() {
  return (
    <div>
      <div className="hero">
        <div className="kicker">Based on the SSC CGL 2025 Notification (released 9 June 2025)</div>
        <h1 className="h1">Exam Pattern &amp; Syllabus</h1>
        <p className="sub">
          The Combined Graduate Level Examination is conducted in two stages — Tier-1 and Tier-2 — followed by Document
          Verification. Tier-1 is qualifying; the final merit is based on Tier-2. This platform is aligned to this
          pattern. Always confirm the current cycle&apos;s details on{" "}
          <a href="https://ssc.gov.in" style={{ color: "var(--brand2)" }}>ssc.gov.in</a>.
        </p>
      </div>

      <div className="card" style={{ marginTop: 22 }}>
        <h2 className="h2">Tier-1 (Computer-Based Test)</h2>
        <p className="sub">100 questions · 200 marks · 60 minutes · Objective MCQs (English &amp; Hindi, except English section). Negative marking: <b>0.5</b> per wrong answer; <b>+2</b> per correct.</p>
        <table className="score">
          <thead><tr><th>Section</th><th>Questions</th><th>Marks</th></tr></thead>
          <tbody>
            {tier1.map((r) => <tr key={r[0]}><td>{r[0]}</td><td>{r[1]}</td><td>{r[2]}</td></tr>)}
            <tr style={{ fontWeight: 800 }}><td>Total</td><td>100</td><td>200</td></tr>
          </tbody>
        </table>
      </div>

      <div className="card" style={{ marginTop: 18 }}>
        <h2 className="h2">Tier-2 — Paper I (compulsory for all posts)</h2>
        <p className="sub">Session I: 2 hours 15 min · Negative marking: <b>1</b> mark per wrong in Sections I, II &amp; Module-I of Section III. Computer Knowledge &amp; DEST are qualifying.</p>
        <table className="score">
          <thead><tr><th>Section</th><th>Subject</th><th>Questions</th><th>Marks</th></tr></thead>
          <tbody>
            {tier2p1.map((r, i) => <tr key={i}><td>{r[0]}</td><td>{r[1]}</td><td>{r[2]}</td><td>{r[3]}</td></tr>)}
          </tbody>
        </table>
        <p className="sub" style={{ marginTop: 10 }}><b>Paper II</b> (Statistics, for JSO posts): 100 questions · 200 marks · 2 hours · −0.5 per wrong. <b>Paper III</b> (General Studies – Finance &amp; Economics, for AAO): as notified.</p>
      </div>

      <h2 className="h2" style={{ marginTop: 28 }}>Detailed Syllabus</h2>
      <div className="grid cols-2">
        {Object.entries(syllabus).map(([sec, items]) => (
          <div className="card" key={sec}>
            <h3 style={{ marginTop: 0 }}>{sec}</h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {items.map((it) => <span key={it} className="badge">{it}</span>)}
            </div>
          </div>
        ))}
      </div>

      <div className="card" style={{ marginTop: 18 }}>
        <h2 className="h2">Key Dates (2025 cycle — for reference)</h2>
        <table className="score">
          <tbody>
            <tr><td>Notification released</td><td>9 June 2025</td></tr>
            <tr><td>Last date to apply</td><td>4 July 2025</td></tr>
            <tr><td>Tier-1 exam</td><td>12–26 September 2025 (plus 14 October)</td></tr>
            <tr><td>Tier-1 result</td><td>18 December 2025</td></tr>
            <tr><td>Tier-2 exam</td><td>18–19 January 2026</td></tr>
            <tr><td>Vacancies</td><td>14,582 (Group B &amp; C)</td></tr>
          </tbody>
        </table>
        <p className="tiny muted" style={{ marginTop: 10 }}>Dates shown are from the 2025 cycle for reference; the next cycle&apos;s schedule will be announced by SSC.</p>
      </div>
    </div>
  );
}
