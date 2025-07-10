import { SummarizeForm } from './_components/summarize-form';

export default function SummarizePage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex flex-col space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">AI Content Summarizer</h2>
        <p className="text-muted-foreground max-w-2xl">
          Paste any text to generate a concise summary. Great for long articles, research papers, or dense study material.
        </p>
      </div>
      <div className="pt-4">
        <SummarizeForm />
      </div>
    </div>
  );
}
