'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { askQuestion, type AskQuestionOutput } from '@/ai/flows/ai-question-answering';
import { useSearchParams } from 'next/navigation';


import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Lightbulb } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  courseMaterial: z.string().min(3, 'Course material must be at least 3 characters long.'),
  question: z.string().min(10, 'Your question must be at least 10 characters long.'),
});

export function AskQuestionForm() {
  const [result, setResult] = useState<AskQuestionOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const topic = searchParams.get('topic');


  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      courseMaterial: '',
      question: '',
    },
  });

  useEffect(() => {
    if (topic) {
      form.setValue('courseMaterial', topic);
      form.setValue('question', `Can you explain "${topic}" in simple terms?`);
      
      const values = {
        courseMaterial: topic,
        question: `Can you explain "${topic}" in simple terms?`
      };
      
      // Automatically submit the form
      onSubmit(values);
    }
  }, [topic, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);
    try {
      const response = await askQuestion(values);
      setResult(response);
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "An error occurred",
        description: "Failed to get an answer from the AI. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Query</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="courseMaterial"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Topic or Course Material</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Paste the relevant text from your course here or enter a topic..." {...field} rows={10} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="question"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Question</FormLabel>
                    <FormControl>
                      <Input placeholder="What do you want to know?" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? 'Thinking...' : 'Ask AI'}
              </Button>
            </CardContent>
          </Card>
        </form>
      </Form>
      <div className="sticky top-20">
        <Card className="min-h-[300px]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-yellow-400" />
              AI's Answer
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading && (
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-[75%]" />
              </div>
            )}
            {result && (
              <p className="text-base leading-relaxed">{result.answer}</p>
            )}
            {!isLoading && !result && (
              <p className="text-sm text-muted-foreground">The AI's answer will appear here once you ask a question.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
