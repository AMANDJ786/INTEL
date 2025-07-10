'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { generateQuiz, type GenerateQuizOutput } from '@/ai/flows/address-learning-challenges';
import { saveQuizProgress } from '@/lib/progress';
import { subjects } from '@/lib/data';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { CheckCircle, XCircle, Trophy, Sparkles } from 'lucide-react';

const formSchema = z.object({
  topic: z.string().min(3, 'Topic must be at least 3 characters long.'),
  numberOfQuestions: z.number().min(1).max(10),
  difficulty: z.enum(['easy', 'medium', 'hard']),
});

type Quiz = GenerateQuizOutput['quiz'];

export default function QuizPage() {
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);

  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: '',
      numberOfQuestions: 5,
      difficulty: 'medium',
    },
  });

  async function onGenerateQuiz(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setQuiz(null);
    resetQuizState(false);
    try {
      const response = await generateQuiz(values);
      setQuiz(response.quiz);
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'An error occurred',
        description: 'Failed to generate the quiz. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  function handleAnswerSubmit() {
    if (!selectedAnswer || !quiz) return;
    const correctAnswer = quiz[currentQuestionIndex].answer;
    const isCorrect = selectedAnswer === correctAnswer;
    if (isCorrect) {
      setScore(s => s + 1);
    }
    setUserAnswers(prev => [...prev, selectedAnswer]);
    setIsAnswered(true);
  }

  function handleNextQuestion() {
    setIsAnswered(false);
    setSelectedAnswer(null);
    setCurrentQuestionIndex(prev => prev + 1);
  }

  function resetQuizState(fullReset = true) {
    setQuiz(null);
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setScore(0);
    if(fullReset) {
      form.reset();
    }
  }
  
  const isQuizFinished = quiz && currentQuestionIndex >= quiz.length;

  if (isQuizFinished) {
    const finalScore = Math.round((score / quiz.length) * 100);
    const chapter = form.getValues('topic');

    // Find subject for the given chapter/topic
    let subjectName = 'General';
    for (const sub of subjects) {
        if (sub.chapters.some(chap => chap.name === chapter)) {
            subjectName = sub.name;
            break;
        }
    }
    saveQuizProgress(subjectName, chapter, finalScore);


    return (
        <div className="flex-1 p-4 md:p-8 pt-6 flex flex-col items-center justify-center text-center">
            <Trophy className="w-24 h-24 text-yellow-400 mb-4" />
            <h2 className="text-4xl font-bold tracking-tight mb-2">Quiz Complete!</h2>
            <p className="text-xl text-muted-foreground mb-6">
                You scored {score} out of {quiz.length}. ({finalScore}%)
            </p>
            <p className="text-sm text-muted-foreground mb-6">Your progress has been saved.</p>
            <Button onClick={() => resetQuizState(true)}>Create Another Quiz</Button>
        </div>
    )
  }


  if (isLoading) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <h2 className="text-3xl font-bold tracking-tight">Generating Your Quiz...</h2>
        <p className="text-muted-foreground">The AI is crafting questions for you. Please wait.</p>
        <Card>
            <CardHeader><Skeleton className="h-6 w-3/4" /></CardHeader>
            <CardContent className="space-y-4">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
            </CardContent>
        </Card>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex flex-col space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">AI Quiz Generator</h2>
          <p className="text-muted-foreground max-w-2xl">
            Challenge yourself! Create a custom quiz on any topic to test your knowledge and retention.
          </p>
        </div>
        <Card className="max-w-2xl mx-auto mt-6">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Sparkles className="text-primary" />
                    Create a Quiz
                </CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onGenerateQuiz)} className="space-y-8">
                    <FormField
                        control={form.control}
                        name="topic"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Topic</FormLabel>
                            <FormControl>
                            <Input placeholder="e.g., The Roman Empire, Photosynthesis" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="numberOfQuestions"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Number of Questions: {field.value}</FormLabel>
                            <FormControl>
                                <Slider
                                    min={1}
                                    max={10}
                                    step={1}
                                    value={[field.value]}
                                    onValueChange={(vals) => field.onChange(vals[0])}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                     <FormField
                        control={form.control}
                        name="difficulty"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Difficulty</FormLabel>
                            <FormControl>
                                <RadioGroup
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    className="flex space-x-4"
                                >
                                    <FormItem className="flex items-center space-x-2 space-y-0">
                                        <FormControl><RadioGroupItem value="easy" /></FormControl>
                                        <FormLabel className="font-normal">Easy</FormLabel>
                                    </FormItem>
                                    <FormItem className="flex items-center space-x-2 space-y-0">
                                        <FormControl><RadioGroupItem value="medium" /></FormControl>
                                        <FormLabel className="font-normal">Medium</FormLabel>
                                    </FormItem>
                                     <FormItem className="flex items-center space-x-2 space-y-0">
                                        <FormControl><RadioGroupItem value="hard" /></FormControl>
                                        <FormLabel className="font-normal">Hard</FormLabel>
                                    </FormItem>
                                </RadioGroup>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <Button type="submit" className="w-full">Generate Quiz</Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
      </div>
    );
  }

  const currentQuestion = quiz[currentQuestionIndex];

  return (
    <div className="flex-1 p-4 md:p-8 pt-6">
        <div className="max-w-2xl mx-auto">
            <div className="text-right text-sm text-muted-foreground mb-2">
                Question {currentQuestionIndex + 1} of {quiz.length} | Score: {score}
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>{currentQuestion.question}</CardTitle>
                </CardHeader>
                <CardContent>
                    <RadioGroup
                        value={selectedAnswer ?? undefined}
                        onValueChange={setSelectedAnswer}
                        disabled={isAnswered}
                        className="space-y-4"
                    >
                        {currentQuestion.options.map((option, index) => {
                            const isCorrect = option === currentQuestion.answer;
                            const isSelected = option === selectedAnswer;
                            return (
                                <FormItem key={index}
                                    className={cn("flex items-center space-x-3 space-y-0 p-4 border rounded-md transition-colors",
                                        isAnswered && isCorrect && "bg-accent/20 border-accent/50",
                                        isAnswered && isSelected && !isCorrect && "bg-destructive/20 border-destructive/50",
                                        !isAnswered && "hover:bg-accent/10"
                                    )}
                                >
                                    <FormControl>
                                        <RadioGroupItem value={option} />
                                    </FormControl>
                                    <FormLabel className="font-normal w-full cursor-pointer flex justify-between items-center">
                                        {option}
                                        {isAnswered && isCorrect && <CheckCircle className="text-accent-foreground" />}
                                        {isAnswered && isSelected && !isCorrect && <XCircle className="text-destructive-foreground" />}
                                    </FormLabel>
                                </FormItem>
                            )
                        })}
                    </RadioGroup>
                    <div className="mt-6 flex justify-end">
                        {isAnswered ? (
                             <Button onClick={handleNextQuestion}>
                                {currentQuestionIndex === quiz.length - 1 ? 'Finish Quiz' : 'Next Question'}
                            </Button>
                        ) : (
                            <Button onClick={handleAnswerSubmit} disabled={!selectedAnswer}>Submit Answer</Button>
                        )}
                    </div>
                </CardContent>
            </Card>
             <Button variant="link" onClick={() => resetQuizState(true)} className="mt-4 mx-auto block">Start Over</Button>
        </div>
    </div>
  )
}
