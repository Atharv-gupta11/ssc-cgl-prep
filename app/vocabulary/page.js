import { getDailyIndex, getDaily } from "@/lib/data";
import DailyView from "@/components/DailyView";

export default function VocabularyPage() {
  const index = getDailyIndex();
  const dates = index.map((d) => d.date);
  const byDate = {};
  for (const d of dates) {
    const data = getDaily(d);
    if (data) byDate[d] = data.vocab;
  }
  return (
    <DailyView
      kind="vocab"
      title="Daily Vocabulary"
      kicker="Most-Probable CGL Words • Updated Daily"
      description="High-frequency vocabulary likely to appear in SSC CGL English (synonyms, antonyms, one-word substitution, cloze). Ten words a day with meaning, synonyms, antonyms and usage. Download date-wise PDFs."
      index={index}
      byDate={byDate}
    />
  );
}
