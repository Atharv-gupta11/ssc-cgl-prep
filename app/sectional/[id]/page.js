import { getSectional, getSectionalIndex, SECTION_LABELS } from "@/lib/data";
import QuizEngine from "@/components/QuizEngine";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return getSectionalIndex().map((t) => ({ id: t.id }));
}

export default function SectionalTestPage({ params }) {
  const test = getSectional(params.id);
  if (!test) notFound();
  const config = {
    title: test.title,
    durationMin: test.durationMin,
    questions: test.questions,
    markPerCorrect: test.markPerCorrect,
    negativePerWrong: test.negativePerWrong,
    sectionLabels: SECTION_LABELS,
    attemptType: "sectional",
  };
  return <QuizEngine config={config} />;
}
