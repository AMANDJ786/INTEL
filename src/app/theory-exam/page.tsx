import { Suspense } from 'react';
import { TheoryExam } from './_components/theory-exam';

function TheoryExamContent() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex flex-col space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Short Theory Exam</h2>
        <p className="text-muted-foreground max-w-2xl">
          Answer the questions on paper, upload a photo of your answers, and let the AI provide feedback on your work.
        </p>
      </div>
      <div className="pt-4">
        <TheoryExam />
      </div>
    </div>
  );
}


export default function TheoryExamPage() {
  return (
    <Suspense fallback={<div className="p-8">Loading Exam...</div>}>
      <TheoryExamContent />
    </Suspense>
  );
}
