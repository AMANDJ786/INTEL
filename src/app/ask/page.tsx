import { AskQuestionForm } from './_components/ask-question-form';

export default function AskQuestionPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex flex-col space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">AI Teaching Assistant</h2>
        <p className="text-muted-foreground max-w-2xl">
          Stuck on a concept? Paste the relevant course material and ask your question. The AI will provide a detailed explanation, just like a real teaching assistant.
        </p>
      </div>
      <div className="pt-4">
        <AskQuestionForm />
      </div>
    </div>
  );
}
