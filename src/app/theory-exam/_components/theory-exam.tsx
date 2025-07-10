'use client';

import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { generateTheoryExam, gradeTheoryAnswers, type GenerateTheoryExamOutput, type GradeTheoryAnswersOutput } from '@/ai/flows/theory-exam-flow';
import { useToast } from '@/hooks/use-toast';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Camera, Check, FileQuestion, Upload, Award } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export function TheoryExam() {
  const searchParams = useSearchParams();
  const chapter = searchParams.get('chapter');
  const { toast } = useToast();

  const [questions, setQuestions] = useState<string[] | null>(null);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [isGrading, setIsGrading] = useState(false);
  const [gradingResult, setGradingResult] = useState<GradeTheoryAnswersOutput | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (chapter) {
      generateTheoryExam({ chapter })
        .then(response => {
          setQuestions(response.questions);
        })
        .catch(error => {
          console.error(error);
          toast({
            variant: "destructive",
            title: "Failed to generate questions",
            description: "Could not create theory questions. Please go back and try again.",
          });
        })
        .finally(() => {
          setIsLoadingQuestions(false);
        });
    } else {
        setIsLoadingQuestions(false);
    }
  }, [chapter, toast]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleGradeExam = async () => {
    if (!selectedFile || !questions) return;

    setIsUploading(true);
    setIsGrading(true);
    setGradingResult(null);

    const reader = new FileReader();
    reader.readAsDataURL(selectedFile);
    reader.onloadend = async () => {
        try {
            const photoDataUri = reader.result as string;
            const response = await gradeTheoryAnswers({ photoDataUri, questions });
            setGradingResult(response);
        } catch (error) {
            console.error(error);
            toast({
                variant: "destructive",
                title: "Grading Failed",
                description: "The AI could not grade your exam. Please try uploading a clearer image.",
            });
        } finally {
            setIsUploading(false);
            setIsGrading(false);
        }
    };
     reader.onerror = () => {
      toast({
        variant: "destructive",
        title: "File Read Error",
        description: "Could not read the selected file.",
      });
      setIsUploading(false);
      setIsGrading(false);
    };
  };
  
  const restartExam = () => {
    setQuestions(null);
    setIsLoadingQuestions(true);
    setIsUploading(false);
    setIsGrading(false);
    setGradingResult(null);
    setSelectedFile(null);
    setPreviewUrl(null);
    if (chapter) {
         generateTheoryExam({ chapter })
        .then(response => {
          setQuestions(response.questions);
        })
        .catch(error => console.error(error))
        .finally(() => setIsLoadingQuestions(false));
    }
  }


  if (isLoadingQuestions) {
    return (
        <Card>
            <CardHeader><CardTitle>Generating Questions...</CardTitle></CardHeader>
            <CardContent className="space-y-4">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-4/5" />
            </CardContent>
        </Card>
    )
  }

  if (!chapter) {
    return <p>No chapter selected. Please go to the Subjects page to start an exam.</p>;
  }
  
  if (gradingResult) {
      return (
          <Card className="max-w-3xl mx-auto">
              <CardHeader className="text-center">
                  <Award className="mx-auto h-16 w-16 text-yellow-400" />
                  <CardTitle className="text-3xl">Exam Graded!</CardTitle>
                  <CardDescription>Final Score: {gradingResult.score}/100</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                    <h3 className="font-semibold text-lg mb-2">AI Feedback:</h3>
                    <p className="text-muted-foreground whitespace-pre-wrap">{gradingResult.feedback}</p>
                </div>
                 <div className="flex justify-center">
                     <Button onClick={restartExam}>Try Again</Button>
                </div>
              </CardContent>
          </Card>
      )
  }

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileQuestion />
            Exam Questions
          </CardTitle>
          <CardDescription>Chapter: {chapter}</CardDescription>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal list-inside space-y-4">
            {questions?.map((q, i) => <li key={i}>{q}</li>)}
          </ol>
        </CardContent>
      </Card>
      <Card className="sticky top-20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera />
            Upload Your Answers
          </CardTitle>
          <CardDescription>Take a clear photo of your handwritten answers and upload it here.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
          
          {previewUrl ? (
             <div className="relative">
                <img src={previewUrl} alt="Answer sheet preview" className="rounded-md w-full aspect-video object-cover" />
                <Button variant="secondary" size="sm" onClick={handleUploadClick} className="absolute top-2 right-2">Change Image</Button>
            </div>
          ) : (
            <button
                onClick={handleUploadClick}
                className="w-full flex flex-col items-center justify-center p-10 border-2 border-dashed rounded-md hover:bg-accent/50 transition-colors"
                disabled={isUploading}
            >
                <Upload className="h-8 w-8 text-muted-foreground" />
                <span className="mt-2 text-sm font-medium">Click to upload image</span>
                <span className="text-xs text-muted-foreground">PNG, JPG, or WEBP</span>
            </button>
          )}

          {isGrading ? (
             <div className="space-y-2">
                <p className="text-sm text-center font-medium">AI is grading your exam...</p>
                <Progress value={undefined} className="w-full animate-pulse" />
            </div>
          ) : (
             <Button onClick={handleGradeExam} disabled={!selectedFile || isUploading} className="w-full">
                <Check className="mr-2" />
                Submit for Grading
            </Button>
          )}

        </CardContent>
      </Card>
    </div>
  );
}
