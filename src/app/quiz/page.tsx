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
import { CheckCircle, XCircle, Trophy, Sparkles, Lightbulb } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

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
  const [userAnswer, setUserAnswer] = useState('');
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
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
    if (!userAnswer || !quiz) return;
    const correctAnswer = quiz[currentQuestionIndex].answer;
    const correct = userAnswer.trim().toLowerCase() === correctAnswer.trim().toLowerCase();
    
    setIsCorrect(correct);
    if (correct) {
      setScore(s => s + 1);
    }
    setIsAnswered(true);
  }

  function handleNextQuestion() {
    setIsAnswered(false);
    setIsCorrect(null);
    setUserAnswer('');
    setCurrentQuestionIndex(prev => prev + 1);
  }

  function resetQuizState(fullReset = true) {
    setQuiz(null);
    setCurrentQuestionIndex(0);
    setUserAnswer('');
    setIsAnswered(false);
    setIsCorrect(null);
    setScore(0);
    if(fullReset) {
      form.reset({
          topic: '',
          numberOfQuestions: 5,
          difficulty: 'medium',
      });
    }
  }
  
  const isQuizFinished = quiz && currentQuestionIndex >= quiz.length;

  if (isQuizFinished) {
    const finalScore = Math.round((score / quiz.length) * 100);
    const chapter = form.getValues('topic');

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
        <h2 className="text-3xl font-bold tracking-tight">Crafting Your Challenge...</h2>
        <p className="text-muted-foreground">The AI is creating unique fill-in-the-blank questions for you. Please wait.</p>
        <Card>
            <CardHeader><Skeleton className="h-6 w-3/4" /></CardHeader>
            <CardContent className="space-y-4">
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
            Challenge yourself with unique **fill-in-the-blank** questions to test your knowledge and retention.
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
  const questionText = currentQuestion.question.replace('[BLANK]', '______');

  return (
    <div className="flex-1 p-4 md:p-8 pt-6">
        <div className="max-w-2xl mx-auto">
            <div className="text-right text-sm text-muted-foreground mb-2">
                Question {currentQuestionIndex + 1} of {quiz.length} | Score: {score}
            </div>
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl leading-snug">{questionText}</CardTitle>
                    <CardDescription>Fill in the blank with the correct term.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <Input
                            id="user-answer"
                            value={userAnswer}
                            onChange={(e) => setUserAnswer(e.target.value)}
                            placeholder="Type your answer here..."
                            disabled={isAnswered}
                            className="text-lg h-12"
                        />
                        
                        {isAnswered && (
                            <Alert variant={isCorrect ? 'default' : 'destructive'} className={cn(isCorrect ? 'border-green-500/50 bg-green-500/10' : '')}>
                                {isCorrect ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                                <AlertTitle>{isCorrect ? 'Correct!' : 'Incorrect'}</AlertTitle>
                                {!isCorrect && (
                                <AlertDescription>
                                    The correct answer is: **{quiz[currentQuestionIndex].answer}**
                                </AlertDescription>
                                )}
                            </Alert>
                        )}

                    </div>
                    <div className="mt-6 flex justify-end">
                        {isAnswered ? (
                             <Button onClick={handleNextQuestion}>
                                {currentQuestionIndex === quiz.length - 1 ? 'Finish Quiz' : 'Next Question'}
                            </Button>
                        ) : (
                            <Button onClick={handleAnswerSubmit} disabled={!userAnswer}>Submit Answer</Button>
                        )}
                    </div>
                </CardContent>
            </Card>
             <Button variant="link" onClick={() => resetQuizState(true)} className="mt-4 mx-auto block">Start Over</Button>
        </div>
    </div>
  )
}
