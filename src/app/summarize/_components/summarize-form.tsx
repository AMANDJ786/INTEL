'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { summarizeContent, type SummarizeContentOutput } from '@/ai/flows/ai-content-summarization';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';

const formSchema = z.object({
  text: z.string().min(100, 'Text to summarize must be at least 100 characters long.'),
});

type StoredSummary = {
  id: string;
  original: string;
  summary: string;
  timestamp: string;
}

export function SummarizeForm() {
  const [result, setResult] = useState<SummarizeContentOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [storedSummaries, setStoredSummaries] = useState<StoredSummary[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    try {
      const items = window.localStorage.getItem('aicademy_summaries');
      if (items) {
        setStoredSummaries(JSON.parse(items));
      }
    } catch (error) {
      console.error("Could not load summaries from localStorage", error);
    }
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { text: '' },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);
    try {
      const response = await summarizeContent(values);
      setResult(response);
      
      const newSummary: StoredSummary = {
        id: new Date().toISOString(),
        original: values.text,
        summary: response.summary,
        timestamp: new Date().toLocaleString()
      };
      
      const updatedSummaries = [newSummary, ...storedSummaries].slice(0, 10);
      setStoredSummaries(updatedSummaries);
      window.localStorage.setItem('aicademy_summaries', JSON.stringify(updatedSummaries));

    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "An error occurred",
        description: "Failed to summarize the content. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }
  
  const handleHistoryClick = (summary: StoredSummary) => {
    form.setValue('text', summary.original);
    setResult({ summary: summary.summary, progress: 'Loaded from history' });
  };


  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Text to Summarize</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="text"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea placeholder="Paste your text here..." {...field} rows={20} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? 'Summarizing...' : 'Generate Summary'}
                </Button>
              </CardContent>
            </Card>
          </form>
        </Form>
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ScrollText className="h-5 w-5 text-primary" />
              Generated Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="min-h-[150px]">
            {isLoading && (
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-[75%]" />
              </div>
            )}
            {result && (
              <p className="text-base leading-relaxed">{result.summary}</p>
            )}
            {!isLoading && !result && (
              <p className="text-sm text-muted-foreground">The summary will appear here.</p>
            )}
          </CardContent>
        </Card>
      </div>
      <div>
        <Card className="sticky top-20">
          <CardHeader>
            <CardTitle>History</CardTitle>
            <CardDescription>Your recent summaries (offline available).</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[600px] -mx-4">
              <div className="px-4">
                {storedSummaries.length > 0 ? (
                  <div className="space-y-4">
                    {storedSummaries.map((item) => (
                      <button key={item.id} onClick={() => handleHistoryClick(item)} className="w-full text-left p-3 rounded-lg border hover:bg-accent/50 transition-colors">
                        <p className="text-sm font-medium truncate">{item.summary}</p>
                        <p className="text-xs text-muted-foreground">{item.timestamp}</p>
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-10">No summaries yet.</p>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
