import { getMock, getMockIndex, SECTION_LABELS } from "@/lib/data";
import QuizEngine from "@/components/QuizEngine";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return getMockIndex().map((m) => ({ id: m.id }));
}

export default function MockTestPage({ params }) {
  const mock = getMock(params.id);
  if (!mock) notFound();
  const config = {
    title: mock.title,
    durationMin: mock.durationMin,
    questions: mock.questions,
    markPerCorrect: mock.markPerCorrect,
    negativePerWrong: mock.negativePerWrong,
    sectionTiming: mock.sectionTiming,
    sectionLabels: SECTION_LABELS,
    attemptType: "mock",
  };
  return <QuizEngine config={config} />;
}
