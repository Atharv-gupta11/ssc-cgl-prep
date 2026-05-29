import { getTopicQuestions, getTopicIndex, SECTION_LABELS } from "@/lib/data";
import TopicPractice from "@/components/TopicPractice";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return getTopicIndex().map((t) => ({ slug: t.slug }));
}

export default function TopicPage({ params }) {
  const data = getTopicQuestions(params.slug);
  if (!data) notFound();
  const { entry, questions } = data;
  return (
    <TopicPractice
      topic={entry.topic}
      sectionName={SECTION_LABELS[entry.section]}
      questions={questions}
    />
  );
}
