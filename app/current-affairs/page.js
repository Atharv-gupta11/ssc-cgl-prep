import { getDailyIndex, getDaily } from "@/lib/data";
import DailyView from "@/components/DailyView";

export default function CurrentAffairsPage() {
  const index = getDailyIndex();
  const dates = index.map((d) => d.date);
  const byDate = {};
  for (const d of dates) {
    const data = getDaily(d);
    if (data) byDate[d] = data.news;
  }
  return (
    <DailyView
      kind="news"
      title="Daily Current Affairs"
      kicker="PIB & Government Sources • Updated Daily"
      description="A concise, exam-focused digest from PIB and official government sources. Each item highlights the key exam point. Download any date as a printable PDF, including previous dates."
      index={index}
      byDate={byDate}
    />
  );
}
